const puppeteer = require("puppeteer");

const GENERAL_META_DATA_KEYS = [
  "title",
  "description",
  "image",
  "type",
  "site_name",
  "url",
  "language",
];

const META_QUERY_TYPES = [
  {
    selector: "meta[property='og:{REPLACE}']",
    prop: "og:",
    rank: 1,
    properties: GENERAL_META_DATA_KEYS,
  },
  {
    selector: "meta[name='dc.{REPLACE}']",
    prop: "dc.",
    rank: 3,
    properties: GENERAL_META_DATA_KEYS,
  },
  { selector: "title", prop: "title", rank: 2 },
  { selector: "meta[name='description']", prop: "description", rank: 2 },
  { selector: "meta[name='keywords']", prop: "keywords", rank: 2 },
];
/**
 * Helper function to make a array unique based on a property.
 * @param {Array} arr Array you wish to make unique.
 * @param {String} prop The prop in which we use to make this array unique.
 * @returns Array that is unique from the one provided.
 */
const uniqueArr = (arr, prop) =>
  arr.filter(({ [prop]: firstProp }, index) => {
    const val = JSON.stringify(firstProp);
    return (
      index ===
      arr.findIndex(({ [prop]: findProp }) => JSON.stringify(findProp) === val)
    );
  });
/**
 * Helper function to convert a unique array into the highest ranked values we want.
 * @param {Array} arr Array you wish to filter on.
 * @returns Filtered array based on rank, rank 1 is highest. So if it exists in rank 1, it will not use the rank 2 value.
 * If it exists in both, it will favor the rank 1, otherwise use the next best thing.
 */
const filterArrByRank = (arr) =>
  arr.reduce((acc, item) => {
    const { key, rank } = item;
    const accIndex = acc.findIndex(({ key: accKey }) => accKey === key);
    if (accIndex > -1) {
      const { rank: accRank } = acc[accIndex];

      if (accRank > rank) {
        acc[accIndex] = item;
      }
    } else {
      acc.push(item);
    }

    return acc;
  }, []);

const prepareMetadataSelectors = META_QUERY_TYPES.map(
  ({ selector, prop, name, rank, properties }) => {
    let result = {
      selector,
      prop,
      domain: "dom",
      key: prop,
      rank,
    };

    if (properties) {
      result = properties.map((key) => ({
        selector: selector.replace("{REPLACE}", key),
        prop: prop + key || name || selector,
        domain: prop.replace(":", "").replace(".", ""),
        key,
        rank,
      }));
    }

    return result;
  }
);
/**
 * Helper function to actuall go fetch the desired values from the page.
 * @param {Object} page This is `page` object from puppeteer package.
 * @param {Object} param1 Formatted meta query types object.
 * @returns Object representing the result found in the page for the query.
 */
const executeMetadataSelector = async (
  page,
  { selector, prop, domain, key, rank }
) => {
  try {
    const value = await page.$eval(
      selector,
      (element) => element.content || element.innerHTML
    );

    return {
      prop,
      value,
      domain,
      selector,
      key,
      rank,
    };
  } catch (e) {
    return null;
  }
};
/**
 * Helper function to convert our results into a canonical formatted object that we can send to the database.
 * @param {Array} results Array of results we want to translate into a cannonical format.
 * @param {String} url URL.
 * @returns Canonical formatted object representing a `Result` in our database.
 */
const formatResults = (results, url) => {
  const keys = [
    "title",
    "description",
    "image",
    "type",
    "site_name",
    "url",
    "keywords",
    "language",
  ];

  return keys.reduce((acc, key) => {
    const item = results.find(({ key: rKey }) => rKey === key);
    if (item) {
      const { value } = item;
      acc[key] = value;
    } else if (!item && key === "url") {
      acc.url = url;
    }

    return acc;
  }, {});
};

/**
 * Helper function to scrape a page's metadata.
 * @param {String} url URL we want to scrape.
 * @returns Canonical formatted object representing the metadata information
 * from the page.
 */
const scrape = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });

  const promises = prepareMetadataSelectors
    .flat()
    .map(async (metadataSelector) =>
      executeMetadataSelector(page, metadataSelector)
    );

  const results = await Promise.all(promises);

  await browser.close();
  const preFilteredResults = results
    .filter((x) => x && Object.keys(x).length > 1)
    .sort((a, b) => (a.rank > b.rank ? 1 : -1));

  const unique = uniqueArr(preFilteredResults, "prop");
  const filtered = filterArrByRank(unique);

  return formatResults(filtered, url);
};

module.exports = {
  executeMetadataSelector,
  filterArrByRank,
  GENERAL_META_DATA_KEYS,
  META_QUERY_TYPES,
  prepareMetadataSelectors,
  scrape,
  uniqueArr,
};
