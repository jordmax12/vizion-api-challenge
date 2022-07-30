const { scrape } = require("../logic/scraper");

/**
 * Helper function to actually perform the scrape.
 * @param {String} url Url of what we want to scrape.
 * @returns A formatted object in canonical format.
 */
const extractMetadataFromUrl = async (url) => {
  try {
    const metaData = await scrape(url);
    return {
      data: metaData,
    };
  } catch (e) {
    console.error(e);
    return {
      error: {
        name: e.name,
        message: e.message,
        stack: e.stack,
      },
    };
  }
};

module.exports = {
  extractMetadataFromUrl,
};
