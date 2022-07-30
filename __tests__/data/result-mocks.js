const mockBaseResult = {
  id: 1,
  reference_id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  status: "IN_PROGRESS",
};

const mockUpdateResult = {
  ...mockBaseResult,
  data: JSON.stringify({
    title: "hello world",
    type: "website",
    url: "https://unit.test",
  }),
};

const mockFindAllRows = [
  {
    dataValues: {
      id: 1,
      reference_id: 1,
      data: JSON.stringify({
        title: "hello world",
      }),
      status: "SUCCESS",
      created_at: mockBaseResult.created_at,
      updated_at: mockBaseResult.updated_at,
    },
  },
  {
    dataValues: {
      id: 2,
      reference_id: 1,
      data: JSON.stringify({
        title: "hello world",
      }),
      status: "SUCCESS",
      created_at: mockBaseResult.created_at,
      updated_at: mockBaseResult.updated_at,
    },
  },
];

const mockReferenceId = 1;

module.exports = {
  mockBaseResult,
  mockFindAllRows,
  mockReferenceId,
  mockUpdateResult,
};
