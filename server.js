const express = require('express')
const app = express()
const port = 3000;
require('dotenv').config()

app.use(express.static("public"))

app.listen(port, () => {
    console.log("Server is running on port " + port);
})


const secret_key = process.env.API_KEY;

const url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=ASD";

async function getData() {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Ocp-Apim-Subscription-Key": secret_key
        }
    });
    const data = await response.json();
    return data;
};

app.get("/api/trains", async (req, res) => {
    const data = await getData();
    res.json(data);
  });