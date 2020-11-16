// const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const Meme = require("./models/meme");

const scraperapiClient = require("scraperapi-sdk")(`${process.env.PROXY_KEY}`);
const urls = {
  jbzUrl: "https://jbzd.com.pl/str/{page}",
};
//
// // const fetchHtml = async (url) => {
// //   try {
// //     const { data } = await axios.get(url);
// //     return data;
// //   } catch {
// //     console.error(
// //       `ERROR: An error occurred while trying to fetch the URL: ${url}`
// //     );
// //   }
// // };
//
const fetchPages = async () => {
  for (let i = 0; i < 2; i++) {
    await fetchScrap(urls.jbzUrl.replace("{page}", i));
  }
};

const fetchScrap = async (url) => {
  const html = await scraperapiClient.get(url);
  const $ = cheerio.load(html);

  const allArtciles = $(".article-content").toArray();

  for (singleArticle of allArtciles) {
    await getAllInformations($(singleArticle));
  }
};

const getAllInformations = async (singleArticle) => {
  const imageTitle = await singleArticle.find("h3 > a").text().trim();
  console.log(imageTitle);

  const photoUrl = await singleArticle.find("a > img").attr("src");
  console.log(photoUrl);

  let dataObject = {
    title: imageTitle,
    photoUrl: photoUrl,
  };

  await saveObjectToDatabase(dataObject);
};

const saveObjectToDatabase = async (dataObject) => {
  const newMeme = new Meme({
    title: dataObject.title,
    photoUrl: dataObject.photoUrl,
  });

//     await newMeme.save();
};

module.exports = fetchPages();
