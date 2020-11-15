const axios = require("axios");
const cheerio = require("cheerio");
equire("dotenv").config();
const scraperapiClient = require("scraperapi-sdk")(`${process.env.PROXY_KEY}`);

const urls = {
  jbzUrl: "https://jbzd.com.pl/",
};

// const fetchHtml = async (url) => {
//   try {
//     const { data } = await axios.get(url);
//     return data;
//   } catch {
//     console.error(
//       `ERROR: An error occurred while trying to fetch the URL: ${url}`
//     );
//   }
// };

const getAllInformations = async (sinlgleArtcile) => {
  //   const allImagesOnPage = $.find("a > img");
  //   const test = scope.$;
  const imageTitle = sinlgleArtcile.find("h3 > a").text();
  console.log(imageTitle);

  const photoUrl = sinlgleArtcile.find("a > img").attr("src");
  console.log(photoUrl);

  //   for (singleTitle of allTitles) {
  //     const title = $(singleTitle).text();
  //     console.log(title);
  //   }
  //   console.log(allTitles);
};

const fetchScrap = async () => {
  const html = await scraperapiClient.get(urls.jbzUrl);
  const $ = cheerio.load(html);

  const allArtciles = $(".article-content").toArray();

  for (singleArticle of allArtciles) {
    await getAllInformations($(singleArticle));
  }
};

fetchScrap();
