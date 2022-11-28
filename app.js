const express = require('express');
const nodecache = require('node-cache');
const axios = require('axios');
require('isomorphic-fetch');

const server = express();
const appCache = new nodecache({ stdTTL : 3599});
const todosURL = 'https://jsonplaceholder.typicode.com/todos';
let dailyBoxOfficeList;
server.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
server.get('/', async (req,res) => {
    if(appCache.has('movieDataList')){
        console.log('Get data from Node Cache');
        return res.json(appCache.get('movieDataList'))
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
        
          return Response.data;
      }).then((response) =>{
        dailyBoxOfficeList = response.boxOfficeResult.dailyBoxOfficeList;
        
        let searchParams;
        const naverHeader ={
          'X-Naver-Client-Id' : 'hjOsmn7IHqbI4ljQ1m8X',
          'X-Naver-Client-Secret' : 'kdx99NEa9k',
        }
        for(var i = 0; i < dailyBoxOfficeList.length; i++){
          searchParams = {query:dailyBoxOfficeList[i].movieNm}
          axios.get('https://openapi.naver.com/v1/search/movie.json',{
            params:searchParams,
            headers:naverHeader,
          }).then((movieData)=> 
          {
            for(let i = 0; i < dailyBoxOfficeList.length; i++){
                if(movieData.data.items[0].title.includes(dailyBoxOfficeList[i].movieNm)){
                    dailyBoxOfficeList[i].image = movieData.data.items[0].image;
                }    
            }
            console.log(dailyBoxOfficeList);
            appCache.set("movieDataList",dailyBoxOfficeList);
          })
        } 
      }).catch((Error) => {
          console.log(Error);
      })
    console.log("The server is listening on port 4000");
});