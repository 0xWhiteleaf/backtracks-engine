const express = require('express');
const morgan = require('morgan')
const path = require('path');

const port = process.env.PORT || 8080;
const buildDir = 'build';
const targetDir = __dirname + '/' + buildDir;

const app = express();

console.log('Using : \'' + targetDir + '\'');
console.log('Server is starting...');

app.use(express.static(targetDir));
app.use(morgan('combined'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(targetDir, 'index.html'));
});

app.listen(port);

console.log('Server started !');
console.log('Listening on port \'' + port + '\'');