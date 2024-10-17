const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// function to respond with index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// function to respond with stylesheet
const getStyle = (request, response) => {
  const style = fs.readFileSync(`${__dirname}/../client/css/style.css`);
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

module.exports = {
  getIndex,
  getStyle,
};
