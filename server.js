const express = require('express');
const cors = require('cors');
const weather = require('openweather-apis');
const geoip = require('geoip-lite');
const app = express();

app.use(cors())


app.get('/', async (req, res) => {
    try {
        const info = {}
        const ip = req.headers['ip']
        if (!ip) {
            res.status(400).json({ msg: 'Failed to fetch' })
        }
        else {
            const geoInfo = geoip.lookup(ip)

            info.ip = ip;
            info.country = geoInfo.country;
            info.latitude = geoInfo.ll[0]
            info.longitude = geoInfo.ll[1];
            info.city = geoInfo.city;

            weather.setCoordinate(info.latitude, info.longitude)
            // weather.setCity('Plateau');

            weather.setAPPID(process.env.WEATHER_API);
            weather.getAllWeather(function (err, JSONObj) {
                info.temp = JSONObj.main.temp;
                info.wind_speed = JSONObj.wind.speed;

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