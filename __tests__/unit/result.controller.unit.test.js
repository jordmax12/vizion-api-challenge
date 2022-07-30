const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindAll = jest.fn();

const ISOPattern =
  /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

const { mockUpdateResult, mockReferenceId } = require("../data/result-mocks");
const {
  mockMultipleResultsByReferenceId,
} = require("../data/nasa-multiple-results");

const {
  createResult,
  getAllResultsByReferenceId,
  updateResultPostProcess,
} = require("../../controllers/result");

jest.mock("../../logic/result", () => ({
  create: async (url) => mockCreate(url),
  findAllByReferenceId: async (referenceId) => mockFindAll(referenceId),
  update: async (id, result) => mockUpdate(id, result),
}));

beforeAll(() => {
  jest.clearAllMocks();
});

describe("testing result controller file", () => {
  test("createResult", async () => {
    mockCreate.mockReturnValueOnce(true);
    const result = await createResult(null, 1, "IN_PROGRESS");
    expect(result).toEqual(true);
    expect(mockCreate.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        data: null,
        reference_id: 1,
        status: "IN_PROGRESS",
      })
    );
    expect(mockCreate.mock.calls[0][0].created_at).toMatch(ISOPattern);
    expect(mockCreate.mock.calls[0][0].updated_at).toMatch(ISOPattern);
  });
  test("getAllResultsByReferenceId", async () => {
    mockFindAll.mockReturnValueOnce(mockMultipleResultsByReferenceId);
    const result = await getAllResultsByReferenceId(mockReferenceId);
    expect(result).toEqual(mockMultipleResultsByReferenceId);
    expect(mockFindAll.mock.calls[0][0]).toEqual(mockReferenceId);
  });
  test("updateResultPostProcess - success", async () => {
    mockUpdate.mockReturnValueOnce(true);
    const mockScrapeData = {
      title: "hello world",
      type: "website",
      url: "https://unit.test",
    };
    const result = await updateResultPostProcess(
      {
        data: mockScrapeData,
      },
      mockUpdateResult
    );
    expect(result).toEqual(true);
    expect(mockUpdate.mock.calls[0]).toEqual(
      expect.arrayContaining([
        1,
        expect.objectContaining({
          id: 1,
          reference_id: 1,
          data: mockScrapeData,
          status: "SUCCESS",
        }),
      ])
    );
    expect(mockUpdate.mock.calls[0][1].created_at).toMatch(ISOPattern);
    expect(mockUpdate.mock.calls[0][1].updated_at).toMatch(ISOPattern);
  });
});
