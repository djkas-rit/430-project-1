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

  /// filter the response if a query parameter is present ///
  // return an array containing a single pokemon matching the id
  if (request.query.id && pokemon[request.query.id - 1]) {
    responseJSON.pokemon = pokemon[request.query.id - 1];
  // return an array containing a single pokemon matching the name
  } else if (request.query.name && pokemon.find((mon) => mon.name === request.query.name)) { 
    responseJSON.pokemon = pokemon.find((mon) => mon.name === request.query.name);
  // return an array of pokemon matching the specified type
  } else if (request.query.type) {
    responseJSON.pokemon = pokemon.filter((mon) => mon.type.includes(request.query.type));
  }
  // limit the response by the specified number
  if (request.query.limit) {
    responseJSON.pokemon = responseJSON.pokemon.slice(0, request.query.limit);
  }
  // offset the response by the specified number
  if (request.query.offset) {
    responseJSON.pokemon = responseJSON.pokemon.slice(request.query.offset);
  }
  // order the response in descending order if specified
  if (request.query.sort === 'desc') {
    responseJSON.pokemon = responseJSON.pokemon.reverse();
  }

  respondJSON(request, response, 200, responseJSON);
};

// function to return a single pokemon by id
const getPokemonById = (request, response) => {
  // set up a default response object
  const responseJSON = {
    message: 'Id is required.',
    id: 'missingParams',
  };

  // check for missing parameter
  if (!request.query.id) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // check that the pokemon exists
  if (pokemon[request.query.id - 1]) {
    return respondJSON(request, response, 200, pokemon[request.query.id - 1]);
  }

  // return a 404 if the pokemon was not found
  responseJSON.message = 'A Pok&eacute;mon with that ID was not found.';
  responseJSON.id = 'notFound';
  return respondJSON(request, response, 404, responseJSON);
};

// function to return a single pokemon by name
const getPokemonByName = (request, response) => {
  // set up a default response object
  const responseJSON = {
    message: 'Name is required.',
    id: 'missingParams',
  };

  // check for missing parameter
  if (!request.query.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // check that the pokemon exists
  let foundPokemon = pokemon.find(p => p.name === request.query.name);
  if (foundPokemon) {
    return respondJSON(request, response, 200, foundPokemon);
  }

  // return a 404 if the pokemon was not found
  responseJSON.message = 'A Pok&eacute;mon with that name was not found.';
  responseJSON.id = 'notFound';
  return respondJSON(request, response, 404, responseJSON);
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
  // set up a default response object
  const responseJSON = {
    message: 'All fields are required.',
    id: 'missingParams',
  };

  // check for missing parameters
  if (!request.body.id ||
    !request.body.num ||
    !request.body.name ||
    !request.body.type ||
    !request.body.height ||
    !request.body.weight ||
    !request.body.weaknesses) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // set up a default response code
  let responseCode = 201;

  // check if the pokemon already exists
  let newPokemon = {};
  if (pokemon.find(p => p.name === request.body.name)) {
    responseCode = 204;
    newPokemon = pokemon.find(p => p.name === request.body.name);
  } else {
    // add the pokemon to the object
    newPokemon = {};
  }

  // add the values to the object
  newPokemon.id = request.body.id;
  newPokemon.name = request.body.name;
  newPokemon.type = request.body.type;
  newPokemon.height = request.body.height;
  newPokemon.weight = request.body.weight;
  newPokemon.weaknesses = request.body.weaknesses;
  
  // return the appropriate response code
  return respondJSON(request, response, responseCode, responseJSON);
};

// function to delete a pokemon by id
const deletePokemon = (request, response) => {
  // set up a default response object
  const responseJSON = {
    message: 'Id is required.',
    id: 'missingParams',
  };

  // check for missing parameter
  if (!request.body.id) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // check if the pokemon exists
  if (pokemon[request.body.id - 1]) {
    // remove the pokemon from the object
    pokemon.splice(request.body.id - 1, 1);
    responseJSON.message = 'The Pok&eacute;mon was deleted successfully.';
    return respondJSON(request, response, 200, responseJSON);
  }

  // return a 404 if the pokemon was not found
  responseJSON.message = 'A Pok&eacute;mon with that ID was not found.';
  responseJSON.id = 'notFound';
  return respondJSON(request, response, 404, responseJSON);
}

module.exports = {
  getPokemon,
  getPokemonById,
  getPokemonByName,
  notFound,
  addPokemon,
  deletePokemon,
};
