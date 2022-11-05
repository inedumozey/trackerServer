const express = require('express');
const geoip = require('geoip-lite');
const app = express();

app.get('/', (req, res) => {

    console.log("workingd")
})


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})