const express = require('express');
const JSZip = require("jszip");

const app = express();
const PORT = 3010;

const zipScreenshots = function() {
}

app.use(express.static('./screenshots'));

app.get('/screenshots', (req, res) => {
  res.send();
});

app.listen(PORT, () => console.log('listening on port', PORT));