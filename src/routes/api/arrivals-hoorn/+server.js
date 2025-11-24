import { API_KEY } from '$env/static/private';
import { readFile, writeFile } from "fs/promises";

// --------------------------------------------------------------------------------------------
// Fetch API
// --------------------------------------------------------------------------------------------
const url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=HN";

async function getArrivals() {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY
        }
    });

    return response.json();
}

// --------------------------------------------------------------------------------------------
// API data filteren en lokaal opslaan
// --------------------------------------------------------------------------------------------
export async function GET() {

    const data = await getArrivals();
    const arrivals = data.payload.arrivals;

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Nieuwe array met alleen data waarvan de origin gelijk is aan een item
    // binnen de array
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const filteredData = arrivals.filter((arrival) => {
        const origins = [
            "Heerlen", "Maastricht", "Eindhoven Centraal", "Roosendaal",
            "Vlissingen", "Tilburg", "Den Bosch", "Arnhem Centraal", "Nijmegen",
            "Zwolle", "Groningen", "Leeuwarden", "Haarlem", "Hoorn"
        ];
        return origins.includes(arrival.origin);
    })

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Nieuwe array met alleen nog maar de relevante keys & values zoals 
    // gedefinieerd in de map functie
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const mappedData = filteredData.map(item => ({
        trainNumber: item.product.number,
        plannedArrivalTime: item.plannedDateTime,
        actualArrivalTime: item.actualDateTime,
        origin: item.origin,
        isCancelled: item.cancelled,
        loggedAt: new Date().toISOString()
    }));

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // 1. readFile leest het JSON bestand en schrijft de inhoud als een string in
    // de variabele fileData
    // 2. fileData wordt omgeschreven naar een javascript Object
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const fileData = await readFile("static/data/arrivalsHoorn.json", "utf8");
    const existingData = JSON.parse(fileData);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Om te voorkomen dat er data dubbel wordt toegevoegd vergelijk ik steeds
    // ieder item met de bestaande data.
    // Ieder item krijgt een key, bestaat de key al? Dan wordt de data
    // overschreven. Bestaat de key nog niet? Dan wordt hij in de array
    // gepushed. 
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    mappedData.forEach(item => {
        const key = item.trainNumber + item.plannedArrivalTime + item.origin;

        const index = existingData.findIndex(existing => {
            return existing.trainNumber + existing.plannedArrivalTime + existing.origin === key
        });

        if (index === -1) {
            existingData.push(item);
        } else {
            existingData[index] = item;
        }
    });

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Existing data wordt omgezet naar JSON en opgeslagen in de variabele
    // updatedJson en die wordt vervolgens gebruikt om het JSON bestand opnieuw
    // te vullen.
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const updatedJson = JSON.stringify(existingData, null, 2);
    await writeFile("static/data/arrivalsHoorn.json", updatedJson, "utf8");

    return new Response(JSON.stringify(filteredData));
}
