// const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const Meme = require("./models/meme");
const logger = require("./utils/logger");

const scraperapiClient = require("scraperapi-sdk")(`${process.env.PROXY_KEY}`);
const urls = {
  kwejkUrl: "https://kwejk.pl",
  nextPageUrl: "https://kwejk.pl/strona/{number}",
};

class KwejkScraper {
  fetchPageParam = async () => {
    const html = await scraperapiClient.get(urls.kwejkUrl);
    const $ = cheerio.load(html);

    const nextPageUrl = $(".btn.btn-gold.btn-next").attr("href");
    const pageNumber = nextPageUrl.slice(-5);

    this.fetchPages(pageNumber);
  };

  fetchPages = async (pageNumber) => {
    const pageCount = parseInt(pageNumber) + 1;
    for (let i = pageCount; i > pageCount - 6; i--) {
      await this.fetchScrap(urls.nextPageUrl.replace("{number}", i));
    }
    logger.info("KWEJK SCRAPER END WORK");
  };

  fetchScrap = async (url) => {
    const html = await scraperapiClient.get(url);
    const $ = cheerio.load(html);

    const allArtciles = $(".box.fav.picture").toArray();

    for (const singleArticle of allArtciles) {
      await this.getAllInformations($(singleArticle));
    }
  };

  getAllInformations = async (singleArticle) => {
    const imageTitle = await singleArticle.find("h2 > a").text().trim();
    const photoUrl = await singleArticle.find("figure > a > img").attr("src");

    logger.info({
      imageTitle: imageTitle,
      photoUrl: photoUrl,
      scraper: "kwejk",
    });

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
      website: "kwejk",
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

module.exports = KwejkScraper;
