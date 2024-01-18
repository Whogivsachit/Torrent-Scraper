const axios = require('axios');
const cheerio = require('cheerio');

const variables = {
    baseUrl: "https://nyaa.si",
    search: (query, page) => `https://nyaa.si/?f=0&c=0_0&q=${query}&p=${page}`,
    table: ".torrent-list > tbody > tr",
    torrent: {
      name: "td:nth-child(2) > a",
      torrent: "td:nth-child(3) > a",
      magnet: "td:nth-child(3) > a:nth-child(2)",
      size: "td:nth-child(4)",
      date: "td:nth-child(5)",
      seeders: "td:nth-child(6)",
      leechers: "td:nth-child(7)",
      downloads: "td:nth-child(8)"
    },
  };

  async function nyaaSi(query, page = '1') {
    try {
      const { data } = await axios.get(variables.search(query, page));
      const $ = cheerio.load(data);
      const torrents = $(variables.table).map((i, row) => ({
        provider: "Nyaa.si",
        title: $(row).find(variables.torrent.name).text().trim(),
        torrent: `${variables.baseUrl}${$(row).find(variables.torrent.torrent).attr('href')}`,
        magnet: $(row).find(variables.torrent.magnet).attr('href'),
        size: $(row).find(variables.torrent.size).text(),
        date: $(row).find(variables.torrent.date).text(),
        seeders: $(row).find(variables.torrent.seeders).text() || 0,
        leechers: $(row).find(variables.torrent.leechers).text() || 0,
        downloads: $(row).find(variables.torrent.downloads).text(),
      })).get();
  
      return torrents;
    } catch (error) {
      return null;
    }
  }

module.exports = nyaaSi;
