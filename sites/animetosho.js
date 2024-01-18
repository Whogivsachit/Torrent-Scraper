const axios = require('axios');
const cheerio = require('cheerio');

const variables = {
    baseUrl: "https://animetosho.org",
    search: (query, page) => `https://animetosho.org/search?q=${query}`,
    table: ".home_list_entry",
    torrent: {
        name: "div.link > a",
        torrent: "a.dllink",
        magnet: "div.links > a:eq(1)",
        size: "div.size",
        date: "div.date",
        seeders: "div.links > span:eq(2)",
        leechers: "div.links > span:eq(2)",
        downloads: ""
    },
  };

  async function animetosho(query, page = '1') {
    try {
      const { data } = await axios.get(variables.search(query, page));
      const $ = cheerio.load(data);
      const torrents = $(".home_list_entry").map((i, row) => {
        const seedersAndLeechersText = $(row).find(variables.torrent.seeders).text();
        const seedersAndLeechersMatch = seedersAndLeechersText.match(/\[(\d+)↑\/(\d+)↓\]/);

        return {
          provider: "animeTosho",
          title: $(row).find(variables.torrent.name).text(),
          torrent: $(row).find(variables.torrent.torrent).attr('href'),
          magnet: $(row).find(variables.torrent.magnet).attr('href'),
          size: $(row).find(variables.torrent.size).text(),
          date: $(row).find(variables.torrent.date).text(),
          seeders: seedersAndLeechersMatch ? seedersAndLeechersMatch[1] : 0,
          leechers: seedersAndLeechersMatch ? seedersAndLeechersMatch[2] : 0,
          downloads: $(row).find(variables.torrent.downloads).text() || 0,
        };

      }).get();

      return torrents;
    } catch (error) {
      return null;
    }
  }

module.exports = animetosho;