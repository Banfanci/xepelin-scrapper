const fetch = require("node-fetch");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

// function to get the raw data from the article
const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};

// start of the program
exports.getArticle = async (articleLink) => {
  const articleHtml = await getRawData(articleLink);
  const parsedArticle = cheerio.load(articleHtml);
  const data = JSON.parse(parsedArticle("#__NEXT_DATA__").text());
  const articleData = data.props.pageProps.article;
  const title = articleData.title;
  const author = articleData.author.name;
  const date = articleData._createdAt;
  const category = articleData.blogCategory.title;
  const readTime = parsedArticle("h1")
    .next()
    .children()
    .first()
    .children()
    .last()
    .text();

  const article = {
    Titular: title,
    Categoría: category,
    Autor: author,
    "tiempo de lectura": readTime,
    "fecha de publicación": date,
  };
  return article;
};

const URL2 = "https://xepelin.com/";

exports.getArticlesLinksFromCategory = async (sectionUrl) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(URL2 + sectionUrl);
  while (true) {
    const [button] = await page.$x("//button[contains(., 'Cargar más')]");
    if (button) {
      await button.click();
      await page.waitForTimeout(500);
    } else {
      break;
    }
  }

  articlesLinks = await page.evaluate(() => {
    articles_elements = document.querySelectorAll('[class^="BlogArticle_box"]');

    articles_array = Array.from(articles_elements);
    return articles_array.map((article) => article.querySelector("a").href);
  });
  await browser.close();

  return articlesLinks;
};

const URL3 = "https://xepelin.com/blog";

exports.getSectionsLinks = async () => {
  const blogHtml = await getRawData(URL3);
  const parsedBlog = cheerio.load(blogHtml);
  const linksSections = [];
  parsedBlog('[class^="Navbar_navbarList"]')
    .find("a")
    .each(function (i, link) {
      linksSections.push(parsedBlog(link).attr("href"));
    });
  return linksSections.slice(1);
};

exports.getSectionLink = async (section) => {
  const blogHtml = await getRawData(URL3);
  const parsedBlog = cheerio.load(blogHtml);
  let sectionLink;
  parsedBlog('[class^="Navbar_navbarList"]')
    .find("a")
    .each(function (i, link) {
      if (parsedBlog(link).text() === section) {
        sectionLink = parsedBlog(link).attr("href");
      }
    });
  return sectionLink;
};

exports.getAllArticlesOfAllSections = async () => {
  const linksSections = await this.getSectionsLinks();
  const allArticlesPromises = [];
  for (let i = 0; i < linksSections.length; i++) {
    allArticlesPromises.push(
      this.getArticlesLinksFromCategory(linksSections[i])
    );
  }
  const allArticles = await Promise.all(allArticlesPromises);
  const allArticlesLinks = allArticles.flat();
  const articlesPromises = [];
  for (let i = 0; i < allArticlesLinks.length; i++) {
    articlesPromises.push(this.getArticle(allArticlesLinks[i]));
  }
  const articles = await Promise.all(articlesPromises);
  return articles;
};

exports.getAllArticlesOfOneSection = async (section) => {
  const linkSection = await this.getSectionLink(section);
  const allArticles = await this.getArticlesLinksFromCategory(linkSection);
  const allArticlesLinks = allArticles.flat();
  const articlesPromises = [];
  for (let i = 0; i < allArticlesLinks.length; i++) {
    articlesPromises.push(this.getArticle(allArticlesLinks[i]));
  }
  const articles = await Promise.all(articlesPromises);
  return articles;
};
