const express = require('express');
const axios = require('axios');
const { json } = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

API_KEY = '59c3c3690cc24e1ecda415ebe6b31871';

app.get('/api/data/:location',(req,res)=>{

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${req.params.location}&appid=${API_KEY}&units=metric`
    
    axios.get(url)
        .then(function (response) {
                res.send(response.data);
        })
        .catch(function (error) {
                res.send(JSON.stringify({ error: "City does not exist"}))
        })


});






