const http = require('http');
const query = require('querystring');
const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// dictionary of endpoints and their handlers
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/pokemon': jsonHandler.getPokemon,
  '/pokemon/{id}': jsonHandler.getPokemonById,
  '/pokemon/{name}': jsonHandler.getPokemonByName,
  '/pokemon/type/{type}': jsonHandler.getPokemonByType,
  notFound: jsonHandler.notFound,
};

// parse the body of the request
const parseBody = (request, response, handler) => {
  // holds the request body
  const body = [];

  // set up error handling for the request
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // set up data handling
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // set up end event for our request
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    handler(request, response);
  });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  const queryParams = parsedUrl.searchParams;
  request.query = Object.fromEntries(queryParams.entries());
  if (urlStruct[parsedUrl.pathname]) {
    parseBody(request, response, urlStruct[parsedUrl.pathname]);
  }
};

// handle head requests
const handleHead = (request, response, parsedUrl) => {
  const queryParams = parsedUrl.searchParams;
  request.query = Object.fromEntries(queryParams.entries());
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

// handle get requests
const handleGet = (request, response, parsedUrl) => {
  const queryParams = parsedUrl.searchParams;
  request.query = Object.fromEntries(queryParams.entries());
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  }
};

// handle requests
const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else {
    urlStruct.notFound(request, response);
  }
};

// start the server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
