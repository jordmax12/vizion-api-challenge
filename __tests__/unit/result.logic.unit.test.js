const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindOne = jest.fn();
const mockFindAll = jest.fn();
const mockDelete = jest.fn();

const {
  create,
  deleteAllResultsByReferenceId,
  findAllByReferenceId,
  findOne,
  update,
} = require("../../logic/result");

const {
  mockBaseResult,
  mockFindAllRows,
  mockReferenceId,
  mockUpdateResult,
} = require("../data/result-mocks");

jest.mock("../../models/index", () => ({
  results: {
    create: async (result) => mockCreate(result),
    update: async (result, opts) => mockUpdate(result, opts),
    destroy: async (id) => mockDelete(id),
    findByPk: async (id) => mockFindOne(id),
    findAll: async (opts) => mockFindAll(opts),
  },
}));

beforeAll(() => {
  jest.clearAllMocks();
});

describe("testing result logic file", () => {
  test("testing create - success", async () => {
    mockCreate.mockReturnValueOnce({
      dataValues: { ...mockBaseResult },
    });
    const result = await create(mockBaseResult);

    expect(result).toEqual({ data: { ...mockBaseResult } });
    expect(mockCreate.mock.calls[0][0]).toEqual(mockBaseResult);
  });
  test("testing create - error", async () => {
    mockCreate.mockRejectedValue(new Error("intentional error"));
    const result = await create(mockBaseResult);
    expect(result).toEqual(
      expect.objectContaining({
        name: "Error",
        message: "intentional error",
      })
    );
    expect(mockCreate.mock.calls[0][0]).toEqual(mockBaseResult);
  });
  test("testing delete - success", async () => {
    mockDelete.mockReturnValueOnce(true);
    const result = await deleteAllResultsByReferenceId(mockReferenceId);
    expect(result).toBeTruthy();
    expect(mockDelete.mock.calls[0][0]).toEqual({
      where: {
        reference_id: mockReferenceId,
      },
    });
  });
  test("testing delete - error", async () => {
    mockDelete.mockRejectedValue(new Error("intentional error"));
    const result = await deleteAllResultsByReferenceId(mockReferenceId);
    expect(result).toBeFalsy();
    expect(mockDelete.mock.calls[0][0]).toEqual({
      where: {
        reference_id: mockReferenceId,
      },
    });
  });
  test("testing update - success", async () => {
    mockUpdate.mockReturnValueOnce(true);
    const result = await update(mockBaseResult.id, mockUpdateResult);

    expect(result).toEqual({ data: { ...mockUpdateResult } });
    expect(mockUpdate.mock.calls[0][0]).toEqual(mockUpdateResult);
  });
  test("testing update - error", async () => {
    mockUpdate.mockRejectedValue(new Error("intentional error"));
    const result = await update(mockBaseResult.id, mockUpdateResult);
    expect(result).toEqual(
      expect.objectContaining({
        name: "Error",
        message: "intentional error",
      })
    );
    expect(mockUpdate.mock.calls[0][0]).toEqual(mockUpdateResult);
  });
  test("testing findAllByReferenceId - success", async () => {
    mockFindAll.mockReturnValueOnce(mockFindAllRows);
    const result = await findAllByReferenceId(mockReferenceId);

    expect(result).toEqual(mockFindAllRows.map((r) => r.dataValues));
    expect(mockFindAll.mock.calls[0][0]).toEqual({
      where: {
        reference_id: mockReferenceId,
      },
      include: "reference",
    });
  });
  test("testing findAllByReferenceId - error", async () => {
    mockFindAll.mockRejectedValue(new Error("intentional error"));
    const result = await findAllByReferenceId(mockReferenceId);

    expect(result).toEqual({
      name: "Error",
      message: `Error retrieving esults by reference id: ${mockReferenceId}`,
    });
    expect(mockFindAll.mock.calls[0][0]).toEqual({
      where: {
        reference_id: mockReferenceId,
      },
      include: "reference",
    });
  });
  test("testing findOne - success", async () => {
    mockFindOne.mockReturnValueOnce({ dataValues: mockUpdateResult });
    const result = await findOne(mockReferenceId);

    expect(result).toEqual({ data: mockUpdateResult });
    expect(mockFindOne.mock.calls[0][0]).toEqual(mockReferenceId);
  });
});
