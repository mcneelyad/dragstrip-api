# Dragstrip API

A simple REST API for retrieving dragstrip data, with filtering by U.S. state. Built with Express.js and supports rate limiting.

## Features

- Get all dragstrip data
- Filter dragstrips by state
- JSON responses
- Rate limiting for abuse prevention
- Basic error handling

## Endpoints

### `GET /`

Returns all dragstrip data.

**Response:**
```json
{
  "message": "success",
  "data": [ ... ]
}
```

### `GET /location?state=STATE_NAME`

Returns dragstrip tracks for a specific U.S. state.

**Query Parameters:**
- `state` (required): Full name of the U.S. state (e.g., "California", "Texas").

**Response (success):**
```json
{
  "message": "success",
  "state": "STATE_NAME",
  "data": [ ... ]
}
```

**Response (error):**
```json
{
  "message": "error",
  "data": "State parameter is required"
}
```

## Rate Limiting

- Maximum 10 requests per 5 minutes per IP.

## Running Locally

1. Install dependencies:
    ```sh
    npm install
    ```
2. Place your dragstrip data in `data/dragstrips.json`.
3. Start the server:
    ```sh
    node index.js
    ```
4. The API will run on [http://localhost:5000](http://localhost:5000) by default.

## Example Data Format

```json
[
  {
    "state": "California",
    "tracks": [
      {
        "name": "Auto Club Raceway",
        "city": "Pomona"
      }
    ]
  }
]
```

## Live Demo
You can test the API live at [Dragstrip API Demo](https://dragstrip-api-299a001ae9ca.herokuapp.com/).