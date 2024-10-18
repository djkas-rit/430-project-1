# Pokédex API

This API allows interaction with the provided Pokémon dataset and has endpoints to retrieve, add, and delete Pokémon information. It supports both `GET` and `POST` requests and can return data in JSON format. Below are the details of the endpoints, including supported query parameters.

The `/pokemon` endpoint is the primary endpoint for retrieving Pokémon data. It supports optional query parameters to filter, limit, offset, and sort the results. The `/getPokemonById` and `/getPokemonByName` endpoints, respectively, allow retrieving Pokémon by their ID or name, as these are unique identifiers. The `/addPokemon` endpoint is used to add a new Pokémon to the dataset, and the `/deletePokemon` endpoint is used to remove a Pokémon by its ID.

## Endpoints

### 1. `GET /pokemon`

Retrieve all Pokémon or filter them based on specific query parameters like `id`, `name`, or `type`.

#### Query Parameters (Optional):
- `id`: Returns a Pokémon with the specified `id`.
  - Example: `/pokemon?id=25` (Returns Pokémon with ID 25)
  
- `name`: Returns a Pokémon with the specified name.
  - Example: `/pokemon?name=Pikachu` (Returns Pikachu)

- `type`: Filters the Pokémon by type (e.g., "Electric", "Fire").
  - Example: `/pokemon?type=Electric` (Returns all Electric-type Pokémon)

- `limit`: Limits the number of Pokémon returned in the response.
  - Example: `/pokemon?limit=10` (Returns the first 10 Pokémon)

- `offset`: Skips a specified number of Pokémon before returning results.
  - Example: `/pokemon?offset=5` (Skips the first 5 Pokémon)

- `sort`: Sorts the Pokémon in descending order if set to `desc`.
  - Example: `/pokemon?sort=desc` (Returns Pokémon in reverse order)

#### Example Request:
```
GET /pokemon?type=Fire&limit=3&sort=desc
```

#### Example Response:
```json
{
  [
    {
        "id": 146,
        "num": "146",
        "name": "Moltres",
        "type": ["Fire", "Flying"],
        "height": "6'7",
        "weight": "132.3 lbs",
        "weaknesses": ["Water", "Electric", "Rock"]
    },
    {
        "id": 136,
        "num": "136",
        "name": "Flareon",
        "type": ["Fire"],
        "height": "2'11",
        "weight": "55.1 lbs",
        "weaknesses": ["Water", "Ground", "Rock"]
    },
    {
        "id": 78,
        "num": "078",
        "name": "Rapidash",
        "type": ["Fire"],
        "height": "5'7",
        "weight": "209.4 lbs",
        "weaknesses": ["Water", "Ground", "Rock"]
    }
  ]
}
```

### 2. `GET /getPokemonById`

Retrieve a single Pokémon by its ID.

#### Query Parameters:
- `id` (required): The ID of the Pokémon to retrieve.
  - Example: `/getPokemonById?id=25` (Returns the Pokémon with ID 25)

#### Example Request:
```
GET /pokemonById?id=1
```

#### Example Response:
```json
{
    "id": 1,
    "num": "001",
    "name": "Bulbasaur",
    "type": ["Grass", "Poison"],
    "height": "2'4",
    "weight": "15.2 lbs",
    "weaknesses": ["Fire", "Psychic", "Flying", "Ice"]
}
```

### 3. `GET /getPokemonByName`

Retrieve a single Pokémon by its name.

#### Query Parameters:
- `name` (required): The name of the Pokémon to retrieve.
  - Example: `/getPokemonByName?name=Charizard` (Returns Charizard)

#### Example Request:
```
GET /pokemonByName?name=Pikachu
```

#### Example Response:
```json
{
  "id": 25,
  "num": "025",
  "name": "Pikachu",
  "type": ["Electric"],
  "height": "1'4",
  "weight": "13.2 lbs",
  "weaknesses": ["Ground"]
}
```

#### Error Responses:
- **400 Bad Request**: If `name` is not provided.
- **404 Not Found**: If no Pokémon with the given `name` exists.

### 4. `POST /addPokemon`

Add a new Pokémon to the dataset. All fields are required in the request body.

#### Request Body:
- `id` (integer): Unique ID of the Pokémon.
- `num` (string): The number of the Pokémon in the Pokédex.
- `name` (string): The name of the Pokémon.
- `type` (array): An array of types for the Pokémon (e.g., `["Fire", "Flying"]`).
- `height` (string): Height of the Pokémon.
- `weight` (string): Weight of the Pokémon.
- `weaknesses` (array): An array of weaknesses for the Pokémon (e.g., `["Water", "Electric"]`).

#### Example Request:
```
POST /addPokemon
```

#### Example Request Body:
```json
{
  "id": 152,
  "num": "152",
  "name": "Chikorita",
  "type": ["Grass"],
  "height": "2'11",
  "weight": "14.1 lbs",
  "weaknesses": ["Fire", "Ice", "Flying", "Bug"]
}
```

### 5. `DELETE /deletePokemon`

Delete an existing Pokémon by its ID.

#### Request Body:
- `id` (required): The ID of the Pokémon to delete.
  - Example: `/deletePokemon` with body `{ "id": 25 }` (Deletes the Pokémon with ID 25)

#### Example Request:
```
DELETE /deletePokemon
```

#### Example Request Body:
```json
{
  "id": 25
}
```

### 6. `GET /notFound`

Returns a 404 error message for invalid or non-existent routes.

#### Example Request:
```
GET /invalidEndpoint
```

#### Example Response:
```json
{
  "message": "The page you are looking for was not found.",
  "id": "notFound"
}
```
