// Get the data from the json file
const pokemon = require('./pokedex.json');

// base function to respond with json
const respondJSON = (request, response, status, object) => {
  // stringify the object
  const data = JSON.stringify(object);

  // set up headers
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  });

  // if the request method is not a head request
  if (request.method !== 'HEAD') {
    // write the object to the response
    response.write(data);
  }

  // send the response
  response.end();
};

/* GET request functions */

// function to return pokemon object
const getPokemon = (request, response) => {
  const responseJSON = { pokemon };

  // filter the response if a query parameter is present
  // return an array containing a single pokemon matching the id
  if (request.query.id && pokemon[request.query.id - 1]) {
    responseJSON.pokemon = pokemon[request.query.id - 1];
    // return an array containing a single pokemon matching the name
  } else if (request.query.name && pokemon[request.query.name]) {
    responseJSON.pokemon = pokemon[request.query.name]; // TODO: this is not working
    // return an array of pokemon matching the specified type
  } else if (request.query.type) {
    responseJSON.pokemon = pokemon.filter((mon) => mon.type.includes(request.query.type));
  }
  // limit the response by the specified number
  if (request.query.limit) {
    responseJSON.pokemon = responseJSON.pokemon.slice(0, request.query.limit);
  }

  respondJSON(request, response, 200, responseJSON);
};

// function to return not found message
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

/* POST request functions */

// function to add a new item from a post
const addPokemon = (request, response) => {
  const responseJSON = {
    message: 'Name, type, and level are all required.',
  };

  // check for missing parameters
  if (!request.body.name || !request.body.type || !request.body.level) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // set up a default response code
  let responseCode = 201;

  // check if the pokemon already exists
  if (pokemon[request.body.name]) {
    responseCode = 204;
  } else {
    // add the pokemon to the object
    pokemon[request.body.name] = {};
  }

  // add the values to the object
  pokemon[request.body.name].name = request.body.name;
  pokemon[request.body.name].type = request.body.type;
  pokemon[request.body.height] = request.body.height;
  pokemon[request.body.weight] = request.body.weight;
  pokemon[request.body.weaknesses] = request.body.weaknesses;

  // return the appropriate response code
  return respondJSON(request, response, responseCode, responseJSON);
};

module.exports = {
  getPokemon,
  notFound,
  addPokemon,
};
