# node-rest

## Node.js movies REST API 

Uses Typescript, Node.js, Express and MongoDB.

## Run locally

Make sure you have Node.js, npm, gulp and MongoDB installed.
Configure MongoURI and ports in .env file.

Run:

<code>$ npm install</code>

<code>$ npm start</code>


Go to localhost:8080/v1/movies to check if app is running.

## Run Test.

Run tests using
<code>npm test</code> command.

## Docker build
Docker files are included. Build with docker using
<code>docker-compose up --build</code> command.

## API

* GET /movies - returs list of all movies
* GET /movies/:movieId - returns movie which imdbID is equal to passed movieId param
* GET /comments - returs list of all movies
* GET /comments/:movieId - returns comment for specified movie
* POST /movies - adds new movie. Request body is:
<code>{"title": "movie title"}</code>
* POST /comments - adds new comment. Request body is: 
<code>{"id": "movie imdbID", "Value": "example comment"}</code>

