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

    const fileData = await readFile("static/data/delays.json", "utf8");
    const existingData = JSON.parse(fileData);


    const mappedData = data.payload.departures.map(item => {
        return {
            trainNumber: item.product.number,
            plannedDepartureTime: item.plannedDateTime,
            actualDepartureTime: item.actualDateTime,
            direction: item.direction,
            loggedAt: new Date().toISOString()
        }
    });

    const transformedData = mappedData.filter(item => {
        return item.direction === "Amsterdam Centraal" || item.direction === "Enkhuizen"
    });

    transformedData.forEach(item => {
        const key = item.trainNumber + item.plannedDepartureTime + item.direction;

        const existingIndex = existingData.findIndex(existingItem => {
            const existingKey =
                existingItem.trainNumber + existingItem.plannedDepartureTime + existingItem.direction;
            return existingKey === key;
        });

        if (existingIndex === -1) {
            existingData.push(item);
        }
        else {
            existingData[existingIndex] = item;
        }
    });

    const updatedJson = JSON.stringify(existingData, null, 2);
    await writeFile("static/data/delays.json", updatedJson, "utf8");

    console.log(transformedData);

    return new Response(JSON.stringify(transformedData), {
        headers: { "Content-Type": "application/json" }
    });
}