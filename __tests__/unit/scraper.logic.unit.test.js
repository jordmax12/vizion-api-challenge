const { filterArrByRank, scrape, uniqueArr } = require("../../logic/scraper");
const {
  nasaUniqueArray: mockUniqueArray,
} = require("../data/nasa-unique-array");
const {
  nasaFilteredArray: mockFilteredArray,
} = require("../data/nasa-filtered-array");
const {
  nasaPreFilteredArray: mockPreFilteredArray,
} = require("../data/nasa-pre-filtered-array");

const mockUrl = "https://nasa.gov";

jest.setTimeout(30000);

describe("testing the scraper logic file", () => {
  test("scrape", async () => {
    const result = await scrape(mockUrl);

    expect(result).toEqual(
      expect.objectContaining({
        title: "National Aeronautics and Space Administration",
        description:
          // eslint-disable-next-line max-len
          "NASA.gov brings you the latest news, images and videos from America's space agency, pioneering the future in space exploration, scientific discovery and aeronautics research.",
        image:
          "http://www.nasa.gov/sites/default/files/images/nasaLogo-570x450.png",
        type: "website",
        site_name: "NASA",
        url: "http://www.nasa.gov/index.html",
      })
    );
  });
  test("filterArrByRank", async () => {
    const result = filterArrByRank(mockUniqueArray);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(mockFilteredArray));
  });
  test("unique", async () => {
    const result = uniqueArr(mockPreFilteredArray, "prop");
    expect(JSON.stringify(result)).toEqual(JSON.stringify(mockUniqueArray));
  });
});
