const express = require('express');
const axios = require('axios');
const { json } = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

API_KEY = '59c3c3690cc24e1ecda415ebe6b31871';

app.get('/api/data/:location',(req,res)=>{

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${req.params.location}&appid=${API_KEY}&units=metric`
    
    let data = null

    axios.get(url)
        .then(function (response) {
                
                var data = response.data;
                final_data = convert(data);
                res.send(data);

        })
        .catch(function (error) {
                console.log(error)
                res.send(JSON.stringify({error : "City does not exist"}))
        })


});

function convert(data){
        var list_of_dates  = [];

        for (date of data["list"]){
                list_of_dates.push(date["dt_txt"].slice(0,10))
        }

        var unique_dates = [... new Set(list_of_dates)]

        for (i=0;i<unique_dates.length;i++){

                var cur_date = unique_dates[i];
                let cur_temp_min = [];
                let cur_temp_max = [];
                let wind_speed = [];

                var chance_of_rain = false

                for(main_data of data["list"]) {
                        if(cur_date === main_data["dt_txt"].slice(0,10)){
                                cur_temp_min.push(main_data["main"]["temp_min"])
                                cur_temp_max.push(main_data["main"]["temp_max"])

                        }

                }

                console.log(cur_date);
                console.log(Math.min(...cur_temp_min));
                console.log(Math.max(...cur_temp_max));
                console.log( );
        }

        return data
}




