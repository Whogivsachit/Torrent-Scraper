const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const app = express();
const fs = require('fs');
const path = require('path');

const siteFolderPath = path.join(__dirname, 'sites/');
const siteFiles = fs.readdirSync(siteFolderPath).filter(file => path.extname(file) === '.js');
const sites = siteFiles.map(file => require(path.join(siteFolderPath, file)));

app.get("/", async (req, res) => {
    const query = req.query.q;
    if(!query) return res.send({error: "No query provided"});

    const fetchData = async (model) => model(query);
    const allData = (await Promise.all(sites.map(fetchData)));
    const sortedData = allData.flat().sort((a, b) => b.seeders - a.seeders);
   
    const stats = {
        query: query,
        total: sortedData.length,
        seeders: sortedData.reduce((acc, cur) => acc + parseInt(cur.seeders), 0),
        leechers: sortedData.reduce((acc, cur) => acc + parseInt(cur.leechers), 0),
        downloads: sortedData.reduce((acc, cur) => acc + parseInt(cur.downloads), 0),
        nyaasi: sortedData.filter(torrent => torrent.provider === "Nyaa.si").length,
        bitsearch: sortedData.filter(torrent => torrent.provider === "BitSearch").length,
        animetosho: sortedData.filter(torrent => torrent.provider === "animeTosho").length,
    };

    res.send({stats: stats, body: sortedData});
});

app.listen(3000, () => console.log('Server running on port http://localhost:3000'));

// Format: Sousou no frieren 01
