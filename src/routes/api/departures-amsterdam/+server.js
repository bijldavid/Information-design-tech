import { API_KEY } from '$env/static/private';
import { readFile, writeFile } from "fs/promises";

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

export async function GET() {
    const data = await getDepartures();
    const departures = data.payload.departures;

    const intercityViaHoorn = departures.filter(departure => {

        const passesHoorn = departure.routeStations?.some(station => {
            return station.mediumName === "Hoorn"
        });

        return passesHoorn;
    });

    const mappedData = intercityViaHoorn.map(item => ({
        trainNumber: item.product.number,
        plannedDepartureTime: item.plannedDateTime,
        actualDepartureTime: item.actualDateTime,
        direction: item.direction,
        loggedAt: new Date().toISOString()
    }));

    const fileData = await readFile("static/data/departuresAmsterdam.json", "utf8");
    const existingData = JSON.parse(fileData);

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

    const updatedJson = JSON.stringify(existingData, null, 2);
    await writeFile("static/data/departuresAmsterdam.json", updatedJson, "utf8");

    return new Response(JSON.stringify(data));
}