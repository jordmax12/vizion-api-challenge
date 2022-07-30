const { extractMetadataFromUrl } = require("../../controllers/scraper");

const mockUrl = "https://jordanmax.io";

const mockScrape = jest.fn();

jest.mock("../../controllers/scraper", () => ({
  extractMetadataFromUrl: async (url) => mockScrape(url),
}));

beforeAll(() => {
  jest.clearAllMocks();
});

describe("testing scraper controller file", () => {
  test("extractMetadataFromUrl", async () => {
    const mockScrapeResult = {
      data: {
        title: "jordanmax.io",
        description: "Welcome to Jordan's world.",
        url: "https://jordanmax.io",
      },
    };
    mockScrape.mockReturnValueOnce(mockScrapeResult);
    const result = await extractMetadataFromUrl(mockUrl);
    expect(result).toEqual(mockScrapeResult);
    expect(mockScrape.mock.calls[0][0]).toEqual(mockUrl);
  });
});
