const http = require('http');
const query = require('querystring');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  // holds the body of the request
  const body = [];

  // set up error handling for our request
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // set up data handling for our end
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // set up end event for our request
  request.on('end', () => {
    // combine our buffer list and convert it to a string
    const bodyString = Buffer.concat(body).toString();
    // parse the string into a map
    request.body = query.parse(bodyString);

    // pass our data to our request handler
    handler(request, response);
  });
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (request.method === 'POST') {
    // handle POST requests
  }
  if (request.method === 'HEAD') {
    // handle HEAD requests
  }
  if (request.method === 'GET') {
    // handle GET requests
  }
};

// start the server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
