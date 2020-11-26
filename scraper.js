// const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const Meme = require("./models/meme");
const logger = require("./utils/logger");

const scraperapiClient = require("scraperapi-sdk")(`${process.env.PROXY_KEY}`);
const urls = {
  jbzUrl: "https://jbzd.com.pl/str/{page}",
};

class JbzScraper {
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
  fetchPages = async () => {
    for (let i = 0; i < 2; i++) {
      await this.fetchScrap(urls.jbzUrl.replace("{page}", i));
    }
    logger.info("SCRAPER END WORK");
    return process.exit(0);
  };

  fetchScrap = async (url) => {
    const html = await scraperapiClient.get(url);
    const $ = cheerio.load(html);

    const allArtciles = $(".article-content").toArray();

    for (const singleArticle of allArtciles) {
      await this.getAllInformations($(singleArticle));
    }
  };

  getAllInformations = async (singleArticle) => {
    const imageTitle = await singleArticle.find("h3 > a").text().trim();
    console.log(imageTitle);

    const photoUrl = await singleArticle.find("a > img").attr("src");
    console.log(photoUrl);

    let dataObject = {
      title: imageTitle,
      photoUrl: photoUrl,
    };

    await this.saveObjectToDatabase(dataObject);
  };

  saveObjectToDatabase = async (dataObject) => {
    const newMeme = new Meme({
      title: dataObject.title,
      photoUrl: dataObject.photoUrl,
    });

    if (newMeme.photoUrl === undefined) {
      return;
    }

    try {
      await newMeme.save();
    } catch (err) {
      logger.error("Meme already in database");
    }
  };
}

module.exports = JbzScraper;
