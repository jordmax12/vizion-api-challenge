const mockCreate = jest.fn();
const mockFindOne = jest.fn();
const mockDelete = jest.fn();

const { create, destroy, findOne } = require("../../logic/reference");

const {
  mockBaseReference,
  mockReferenceId,
  mockUrl,
} = require("../data/reference-mocks");

const ISOPattern =
  /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

jest.mock("../../models/index", () => ({
  references: {
    create: async (result) => mockCreate(result),
    destroy: async (id) => mockDelete(id),
    findByPk: async (id) => mockFindOne(id),
  },
}));

beforeAll(() => {
  jest.clearAllMocks();
});

describe("testing result logic file", () => {
  test("testing create - success", async () => {
    mockCreate.mockReturnValueOnce({
      dataValues: { ...mockBaseReference },
    });
    const result = await create(mockUrl);

    expect(result).toEqual({
      data: expect.objectContaining({
        id: mockReferenceId,
        url: mockUrl,
      }),
    });

    expect(result.data.created_at).toMatch(ISOPattern);
    expect(mockCreate.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        url: mockUrl,
      })
    );
    expect(mockCreate.mock.calls[0][0].created_at).toMatch(ISOPattern);
  });
  test("testing create - error", async () => {
    mockCreate.mockRejectedValue(new Error("intentional error"));
    const result = await create(mockUrl);
    expect(result).toEqual(
      expect.objectContaining({
        name: "Error",
        message: "intentional error",
      })
    );
    expect(mockCreate.mock.calls[0][0]).toEqual(
      expect.objectContaining({ url: mockUrl })
    );
    expect(mockCreate.mock.calls[0][0].created_at).toMatch(ISOPattern);
  });
  test("testing destroy - success", async () => {
    mockDelete.mockReturnValueOnce(true);
    const result = await destroy(mockReferenceId);
    expect(result).toBeTruthy();
    expect(mockDelete.mock.calls[0][0]).toEqual({
      where: {
        id: mockReferenceId,
      },
    });
  });
  test("testing destroy - error", async () => {
    mockDelete.mockRejectedValue(new Error("intentional error"));
    const result = await destroy(mockReferenceId);
    expect(result).toBeFalsy();
    expect(mockDelete.mock.calls[0][0]).toEqual({
      where: {
        id: mockReferenceId,
      },
    });
  });
  test("testing findOne - success", async () => {
    mockFindOne.mockReturnValueOnce({ dataValues: mockBaseReference });
    const result = await findOne(mockReferenceId);

    expect(result).toEqual({
      data: expect.objectContaining(mockBaseReference),
    });

    expect(result.data.created_at).toMatch(ISOPattern);
    expect(mockFindOne.mock.calls[0][0]).toEqual(mockReferenceId);
  });
  test("testing findOne - error", async () => {
    mockFindOne.mockRejectedValue(new Error("intentional error"));
    const result = await findOne(mockReferenceId);
    expect(result).toEqual(
      expect.objectContaining({
        name: "Error",
        message: "Error retrieving reference with id: 1. intentional error",
      })
    );
    expect(mockFindOne.mock.calls[0][0]).toEqual(mockReferenceId);
  });
});
