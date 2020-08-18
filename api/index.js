require("dotenv-safe").config();

const http = require('http');
const express = require('express')
const routes = require('./src/routes')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);

const server = http.createServer(app);
server.listen(3000);
console.log("Server listening in port 3000...")