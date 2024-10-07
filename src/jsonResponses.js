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

// function to get all pokemon
const getAllPokemon = (request, response) => {
  const responseJSON = { pokemon };

  // limit the response if the user specifies a limit
  if (request.query.limit) {
    responseJSON.pokemon = responseJSON.pokemon.slice(0, request.query.count);
  }

  respondJSON(request, response, 200, responseJSON);
};

// function to get a single pokemon by id
const getPokemonById = (request, response) => {
  const { id } = request.params;
  const responseJSON = {};

  if (pokemon[id]) {
    responseJSON.pokemon = pokemon[id];
    respondJSON(request, response, 200, responseJSON);
  } else {
    responseJSON.message = `Pokemon with ID ${id} not found.`;
    respondJSON(request, response, 404, responseJSON);
  }
};

// function to get a single pokemon by name
const getPokemonByName = (request, response) => {
  const { name } = request.params;
  const responseJSON = {};

  const pokemonByName = pokemon.find((mon) => mon.name.toLowerCase() === name.toLowerCase());

  if (pokemonByName) {
    responseJSON.pokemon = pokemonByName;
    respondJSON(request, response, 200, responseJSON);
  } else {
    responseJSON.message = `Pokemon with name ${name} not found.`;
    respondJSON(request, response, 404, responseJSON);
  }
};

// function to get an array of pokemon by type
const getPokemonByType = (request, response) => {
  const { type } = request.params;
  const responseJSON = {};

  const filteredPokemon = pokemon.filter((mon) => mon.type.includes(type.toLowerCase()));

  if (filteredPokemon.length > 0) {
    responseJSON.pokemon = filteredPokemon;
    respondJSON(request, response, 200, responseJSON);
  } else {
    responseJSON.message = `No Pokemon found with type ${type}.`;
    respondJSON(request, response, 404, responseJSON);
  }
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
  getAllPokemon,
  getPokemonById,
  getPokemonByName,
  getPokemonByType,
  notFound,
  addPokemon,
};
