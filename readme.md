# Web Development 2, 2021, Assignment 4

## Heroku Link: [https://jardskjaldtar.herokuapp.com/](https://jardskjaldtar.herokuapp.com/)

In this assignment, you are required to implement a server that acts as a proxy between the client and the USGS (United States Geological Survey) data source. This proxy should cache data between requests using Redis.

Additionally, you should implement the ability to retrieve all data based on time intervals and magnitudes. In the `index.html` file, a list of links for each type is provided. You need to implement frontend functionality that retrieves the correct data through the proxy service. Proxy service requests should accept query string parameters, e.g., `/proxy?period=hour&type=significant`, and return data along with additional metadata about the request.

### Request Metadata

Metadata about requests should include two values:

1. Whether the data was retrieved from the cache or not.
2. The time it took to retrieve the data in seconds (whether from cache or fetched), see `./src/time.js`.

The format of this metadata should be:

```javascript
{
  data, // earthquake data
  info: {
    cached: true,
    elapsed: 0.500,
  },
}

```


### Fetch

Both the frontend (client) and backend (server) will make fetch calls, and it is crucial to understand the difference between them.

Frontend code is located in ./client, and backend code is in ./src.

The frontend communicates with the backend proxy service, and the backend communicates with the USGS service if the data is not cached.



Setja skal upp `redis` og nota til að cachea gögn.

Setja skal verkefnið upp á Heroku með cache virkni.

