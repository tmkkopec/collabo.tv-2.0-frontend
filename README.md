# collabo.tv

## Requirements
* node.js
* npm (included in node.js)

## Usage
* `git clone` repo
* `cd` to repo
* `npm install` to fetch dependencies for server side

## Generate static files
* `npm run build` to build static files. Output is in `build` directory
* copy `build` directory to backend server directory `public`
* run backend server: `npm start` 

## Development build (with backend server)
* start frontend server: `npm start`. Server running on port 3000 
* start backend server on port 3001: `PORT=3001 npm start`
* access website at [http://localhost:3000](http://localhost:3000)

Every request from frontend project is proxied to backend server.