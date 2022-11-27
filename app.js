const express = require('express');
const nodecache = require('node-cache');
require('isomorphic-fetch');

const server = express();
const appCache = new nodecache({ stdTTL : 3599});
const todosURL = 'https://jsonplaceholder.typicode.com/todos';

server.get('/', async (req,res) => {
    if(appCache.has('todos')){
        console.log('Get data from Node Cache');
        return res.send(appCache.get('todos'))
    }
    else{
        const data = await fetch(todosURL)
            .then((response) => response.json());
        appCache.set("todos",data);
        console.log('Fetch data from API');
        res.send(data);
    }
})

server.listen(3030, (err) => {
    if (err) return console.log(err);
    console.log("The server is listening on port 3030");
  });