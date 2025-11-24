import { API_KEY } from '$env/static/private';
import { readFile, writeFile } from "fs/promises";

// --------------------------------------------------------------------------------------------
// Fetch API
// --------------------------------------------------------------------------------------------
const url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=ASD";

async function getDepartures() {
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

    const data = await getDepartures();
    const departures = data.payload.departures;

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Nieuwe array met alleen data waarbij de trein station "Hoorn" passeert
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const intercityViaHoorn = departures.filter(departure => {
        const passesHoorn = departure.routeStations?.some(station => {
            return station.mediumName === "Hoorn"
        });
        return passesHoorn;
    });

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Nieuwe array met alleen nog maar de relevante keys & values zoals 
    // gedefinieerd in de map functie
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const mappedData = intercityViaHoorn.map(item => ({
        trainNumber: item.product.number,
        plannedDepartureTime: item.plannedDateTime,
        actualDepartureTime: item.actualDateTime,
        direction: item.direction,
        isCancelled: item.cancelled,
        loggedAt: new Date().toISOString()
    }));

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // 1. readFile leest het JSON bestand en schrijft de inhoud als een string in
    // de variabele fileData
    // 2. fileData wordt omgeschreven naar een javascript Object
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const fileData = await readFile("static/data/departuresAmsterdam.json", "utf8");
    const existingData = JSON.parse(fileData);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Om te voorkomen dat er data dubbel wordt toegevoegd vergelijk ik steeds
    // ieder item met de bestaande data.
    // Ieder item krijgt een key, bestaat de key al? Dan wordt de data
    // overschreven. Bestaat de key nog niet? Dan wordt hij in de array
    // gepushed. 
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    mappedData.forEach(item => {
        const key = item.trainNumber + item.plannedDepartureTime + item.direction;

        const index = existingData.findIndex(existing => {
            return existing.trainNumber + existing.plannedDepartureTime + existing.direction === key
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
    await writeFile("static/data/departuresAmsterdam.json", updatedJson, "utf8");

    return new Response(JSON.stringify(mappedData));
}