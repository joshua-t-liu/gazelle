const express = require('express');
const compression = require('compression')
const JSZip = require("jszip");
const { getPhoneData } = require('../db');

const app = express();
const PORT = 3100;

const zipScreenshots = function() {
}

app.use(compression());

app.use(express.static('./dist'));

app.get('/screenshots', (req, res) => {
  res.send();
});

app.get('/phones', (req, res) => {
  getPhoneData(res);
});

app.listen(PORT, () => console.log('listening on port', PORT));
