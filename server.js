const http = require('http');

const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 8081;

server.listen(port, ()=>{
    console.log("server started at port " + port);
});