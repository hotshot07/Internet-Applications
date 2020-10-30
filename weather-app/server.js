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

                var data = response.data;
                let final_data = convert(data);
                res.send(final_data);

        })
        .catch(function (error) {
                console.log(error)
                res.send(JSON.stringify({error : "City does not exist"}))
        })


});

function convert(data){

        final_data = {
                city: data.city.name,
                country: data.city.country,
                weather: []
        }


        var list_of_dates  = [];

        for (date of data["list"]){
                list_of_dates.push(date["dt_txt"].slice(0,10))
        }

        var unique_dates = [... new Set(list_of_dates)]

        var global_min = Infinity;
        var global_max = -Infinity;

        for (i=0;i<unique_dates.length;i++){

                let weather_object = {}

                var cur_date = unique_dates[i];
                let cur_temp_min = [];
                let cur_temp_max = [];
                let wind_speed = [];
                
                var weather_type = null
                var rain_object = {}


                var chance_of_rain = false

                for(main_data of data["list"]) {
                        if(cur_date === main_data["dt_txt"].slice(0,10)){

                                cur_temp_min.push(main_data["main"]["temp_min"])
                                cur_temp_max.push(main_data["main"]["temp_max"])
                                weather_type = main_data.weather[0].main

                                if(weather_type === "Rain"){
                                        chance_of_rain = true;
                                        rain_object[main_data["dt_txt"].slice(11,19)] = main_data["rain"]["3h"]
                                }

                                wind_speed.push(main_data["wind"]["speed"])

                        }

                }

                
                min_temp = Math.min(...cur_temp_min)
                max_temp = Math.max(...cur_temp_max)

                weather_object["date"] = cur_date
                weather_object["max_temp"] = max_temp;
                weather_object["min_temp"] = min_temp;
                weather_object["wind_speed"] = Math.max(...wind_speed);
                weather_object["weather_type"] = weather_type
                weather_object["rain"] = chance_of_rain

                if(chance_of_rain){
                        weather_object["expected_raifall"] = rain_object;
                }

                final_data.weather.push(weather_object)

                if(min_temp < global_min){
                        global_min = min_temp;
                }

                if(max_temp>global_max){
                        global_max = max_temp;
                }

        }

        let avg_temp = (global_max+global_min)/2

        if(avg_temp > -10 && avg_temp <= 10){
                final_data["packing"] = "cold";
        }else if (avg_temp >10  && avg_temp <=20){
                final_data["packing"] = "warm";
        }else if (avg_temp >20){
                final_data["packing"] = "hot";
        }else{
                final_data["packing"] = "extreme_cold";
        }

        return final_data
}




