const mockCreate = jest.fn();
const mockFindReferenceId = jest.fn();
const mockCreateResult = jest.fn();
const mockUpdateResultPostProcess = jest.fn();
const mockScrape = jest.fn();
const mockSendSQSMessage = jest.fn(async () => true);

const mockUrl = "https://jordanmax.io";

const ISOPattern =
  /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

const { mockReferenceId } = require("../data/reference-mocks");

const {
  createReference,
  findReference,
  referenceListener,
} = require("../../controllers/reference");

jest.mock("../../logic/reference", () => ({
  create: async (url) => mockCreate(url),
  findOne: async (id) => mockFindReferenceId(id),
}));

jest.mock("../../controllers/scraper", () => ({
  extractMetadataFromUrl: async (url) => mockScrape(url),
}));

jest.mock("../../controllers/result", () => ({
  createResult: async (data, id, status) => mockCreateResult(data, id, status),
  updateResultPostProcess: async ({ error, data }, initialResult) =>
    mockUpdateResultPostProcess({ error, data }, initialResult),
}));

jest.mock("aws-sdk", () => ({
  SQS: jest.fn(() => ({
    sendMessage: mockSendSQSMessage,
  })),
}));

beforeAll(() => {
  jest.clearAllMocks();
});

describe("testing the references controller file", () => {
  test("createReference", async () => {
    mockCreate.mockReturnValueOnce(true);
    const result = await createReference(mockUrl);
    expect(result).toEqual(true);
    expect(mockCreate.mock.calls[0][0]).toEqual(mockUrl);
  });
  test("findReference", async () => {
    mockFindReferenceId.mockReturnValueOnce({
      id: 1,
      url: mockUrl,
      created_at: new Date().toISOString(),
    });
    const result = await findReference(mockReferenceId);
    expect(result).toEqual(
      expect.objectContaining({
        id: 1,
        url: mockUrl,
      })
    );
    expect(result.created_at).toMatch(ISOPattern);
    expect(mockFindReferenceId.mock.calls[0][0]).toEqual(mockReferenceId);
  });
  test("referenceListener", async () => {
    const mockReceiptHandle = "123";
    mockFindReferenceId.mockReturnValueOnce({
      data: {
        id: mockReferenceId,
        url: mockUrl,
        created_at: new Date().toISOString(),
      },
    });

    const mockCreateResultValues = {
      data: {
        id: mockReferenceId,
        reference_id: mockReferenceId,
        data: JSON.stringify({}),
        status: "IN_PROGRESS",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    mockCreateResult.mockReturnValueOnce(mockCreateResultValues);

    const mockScrapeResult = {
      data: {
        title: "jordanmax.io",
        description: "Welcome to Jordan's world.",
        url: "https://jordanmax.io",
      },
    };
    mockScrape.mockReturnValueOnce(mockScrapeResult);

    mockUpdateResultPostProcess.mockReturnValueOnce(true);

    const result = await referenceListener({
      ReceiptHandle: mockReceiptHandle,
      MessageAttributes: {
        id: {
          StringValue: "1",
        },
      },
    });

    expect(result).toEqual(mockReceiptHandle);
    expect(mockFindReferenceId.mock.calls[0][0]).toEqual(
      parseInt(mockReferenceId, 10)
    );

    expect(mockCreateResult.mock.calls[0]).toEqual([
      null,
      mockReferenceId,
      "IN_PROGRESS",
    ]);
    expect(mockScrape.mock.calls[0][0]).toEqual(mockUrl);
    expect(mockUpdateResultPostProcess.mock.calls[0]).toEqual([
      mockScrapeResult,
      mockCreateResultValues.data,
    ]);
  });
});
