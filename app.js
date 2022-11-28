const express = require('express');
const nodecache = require('node-cache');
const axios = require('axios');
require('isomorphic-fetch');

const server = express();
const appCache = new nodecache({ stdTTL : 3599});
const todosURL = 'https://jsonplaceholder.typicode.com/todos';

server.get('/', async (req,res) => {
    if(appCache.has('movieData')){
        console.log('Get data from Node Cache');
        return res.json(appCache.get('movieData'))
    }
})
const movieParams = {
    key:'01b8c9367db48a7e1abfd82921b4d640',
    targetDt:'20221125',
    itemPerPage: '20'
  }
server.listen(4000, (err) => {
    if (err) return console.log(err);
    axios.get('http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json',{ params: movieParams })
      .then((Response)=>{
        appCache.set("movieData",Response.data)
          return Response.data;
      }).then((response) =>{
        let dailyBoxOfficeList = response.boxOfficeResult.dailyBoxOfficeList;
        let searchParams;
        const naverHeader ={
          'X-Naver-Client-Id' : 'hjOsmn7IHqbI4ljQ1m8X',
          'X-Naver-Client-Secret' : 'kdx99NEa9k',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
        for(var i = 0; i < dailyBoxOfficeList.length; i++){
          // searchParams = {query:dailyBoxOfficeList[i].movieNm}
          // axios.get('/v1/search/movie.json',{
          //   params:searchParams,
          //   headers:naverHeader,
          //   withCredentials: true,
          //   credentials: 'same-origin',
          // }).then((movieData)=> 
          // {
          // })
        } 
      }).catch((Error) => {
          console.log(Error);
      })
    console.log("The server is listening on port 4000");
});