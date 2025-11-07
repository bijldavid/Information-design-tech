import { API_KEY } from '$env/static/private';
import { readFile, writeFile } from "fs/promises";

const url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=HN";

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

    const intercityViaAmsterdam = departures.filter(departure => {

        const passesAmsterdam = departure.routeStations?.some(
            station => station.mediumName === "Amsterdam C."
        );

        const isFromAmsterdamDirection = departure.direction === "Enkhuizen";

        return (passesAmsterdam || isFromAmsterdamDirection);
    });

    const mappedData = intercityViaAmsterdam.map(item => ({
        trainNumber: item.product.number,
        plannedDepartureTime: item.plannedDateTime,
        actualDepartureTime: item.actualDateTime,
        direction: item.direction,
        loggedAt: new Date().toISOString()
    }));

    const fileData = await readFile("static/data/delays.json", "utf8");
    const existingData = JSON.parse(fileData);

    mappedData.forEach(item => {
        const key = item.trainNumber + item.plannedDepartureTime + item.direction;

        const index = existingData.findIndex(existing =>
            existing.trainNumber + existing.plannedDepartureTime + existing.direction === key
        );

        if (index === -1) {
            existingData.push(item);
        } else {
            existingData[index] = item;
        }
    });

    const updatedJson = JSON.stringify(existingData, null, 2);
    await writeFile("static/data/delays.json", updatedJson, "utf8");

    return new Response(JSON.stringify(mappedData), {
        headers: { "Content-Type": "application/json" }
    });
}