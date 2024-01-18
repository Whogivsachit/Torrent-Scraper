const axios = require('axios');
const cheerio = require('cheerio');

const variables = {
    baseUrl: "https://bitsearch.to",
    search: (query, page) => `https://bitsearch.to/search?q=${query}&page=${page}&sort=seeders`,
    table: ".search-result",
    torrent: {
      name: "h5.title a",
      torrent: "div.links > a:nth-child(1)",
      magnet:  "div.links > a:nth-child(2)",
      size: "div.stats > div:nth-child(2)",
      date: "div.stats > div:nth-child(5)",
      seeders: "div.stats > div:nth-child(3)",
      leechers: "div.stats > div:nth-child(4)",
      downloads: "div.stats > div:nth-child(1)"
    },
  };

  async function bitsearch(query, page = '1') {
    try {
      const { data } = await axios.get(variables.search(query, page));
      const $ = cheerio.load(data);
      const torrents = $(variables.table).map((i, row) => ({
        provider: "BitSearch",
        title: $(row).find(variables.torrent.name).text(),
        torrent: $(row).find(variables.torrent.torrent).attr('href'),
        magnet: $(row).find(variables.torrent.magnet).attr('href'),
        size: $(row).find(variables.torrent.size).text(),
        date: $(row).find(variables.torrent.date).text(),
        seeders: $(row).find(variables.torrent.seeders).text().trim() || 0,
        leechers: $(row).find(variables.torrent.leechers).text().trim() || 0,
        downloads: $(row).find(variables.torrent.downloads).text(),
      })).get();
      
      return torrents;
    } catch (error) {
      return null;
    }
  }

module.exports = bitsearch;


