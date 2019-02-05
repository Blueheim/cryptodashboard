const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

app.use(helmet());
app.use(compression());

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('*', function(req, res) {
  res.sendFile('index.html');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
