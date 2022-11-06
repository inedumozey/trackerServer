const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const weather = require('openweather-apis');
const geoip = require('geoip-lite');
const app = express();

app.use(cors())

app.get('/test', async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=201301&appid=${process.env.WEATHER_API}&units=metric`);

        console.log(data)
    }
    catch (err) {
        res.status(500).json({ msg: err.message || 'Server error' })
    }
})

app.get('/', async (req, res) => {
    try {
        const info = {}
        const ip = req.headers['ip']
        const latitude = req.headers['latitude']
        const longitude = req.headers['longitude']

        if (!ip || !longitude || !latitude) {
            res.status(400).json({ msg: 'Failed to fetch' })
        }
        else {
            const geoInfo = geoip.lookup(ip)

            info.ip = ip;
            info.country = geoInfo.country;
            // info.latitude = geoInfo.ll[0]
            // info.longitude = geoInfo.ll[1];

            // console.log(geoInfo)

            weather.setCoordinate(latitude, longitude)
            // console.log(latitude, longitude)
            // weather.setCity('Plateau');

            weather.setAPPID(process.env.WEATHER_API);
            weather.getAllWeather(function (err, JSONObj) {
                info.temp = JSONObj.main.temp;
                info.wind_speed = JSONObj.wind.speed;
                info.city = JSONObj.name;
                info.city = JSONObj.name;
                info.city = JSONObj.name;

                res.status(200).json({ msg: 'successfull', data: info })
            });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err.message || 'Server error' })
    }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})