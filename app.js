const express = require("express") ;  //external module 
const https = require("https") ;        //native node module
const bodyParser = require("body-parser") ; //external module ,
//body parser allows us to look through the body of the post request and fetch the data based on the name attribute of the input

const app = express() ;

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){

      res.sendFile(__dirname+"/index.html") ;

})

app.post("/",function(req,res){
      console.log("post request received") ;
     
       //fetching data from the external api weather app using get method of https
  const city  = req.body.cityName ;
 const apiKey = "9fa86da2407d872c79d0c36903325df9"; //authentication
  const unit = "metric"
 const url = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=" + apiKey +"&units=" +unit;

 //making get request across the internet using the https protocol
 https.get(url,function(response){
        // console.log(response) ;    //gives entire response from the external server where request is made
       //  console.log(response.statusCode) ;
        response.on("data",function(data){
           console.log(data); // gives hexadecimal codes  of the weather data
           const weatherData  = JSON.parse(data) ;   //converts the hexadecimal code into javascript object
         //   console.log(weatherData) ;
           const temp = weatherData.main.temp;
           // console.log(temp) ;
           const weatherDescription = weatherData.weather[0].description;
           // console.log(weatherDescription) ;
           const icon = weatherData.weather[0].icon;
           const imageUrl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png" ;
           console.log(icon) ;
         

            //we can only have 1 res.send in a  single app.get
            //But we can have multiple res.write
            res.set('Content-Type', 'text/html');
            res.write("the weather is currently " + weatherDescription) ;
           res.write("<h1>the temperature in " + city + " is  "+ temp + " deg Celcius</h1>" ) ;   
           res.write("<img src=" + imageUrl + " >");
           
           res.send() ;
        })
});
// res.send("server is up and running ")
      
})

app.listen(3000,function(){
    console.log("server is running on port 3000") ;
})