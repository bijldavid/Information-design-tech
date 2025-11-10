import { API_KEY } from '$env/static/private';
import { readFile, writeFile } from "fs/promises";

const url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=ASD";

async function getArrivals() {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY
        }
    });

    return response.json();
}


export async function GET() {
    const data = await getArrivals();
    const arrivals = data.payload.arrivals;

    const filteredData = arrivals.filter((arrival) => {
        return arrival.origin === "Enkhuizen"
    });

    const mappedData = filteredData.map(item => ({
        trainNumber: item.product.number,
        plannedArrivalTime: item.plannedDateTime,
        actualArrivalTime: item.actualDateTime,
        origin: item.origin,
        isCancelled: item.cancelled,
        loggedAt: new Date().toISOString()
    }));

    const fileData = await readFile("static/data/arrivalsAmsterdam.json", "utf8");
    const existingData = JSON.parse(fileData);

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

    const updatedJson = JSON.stringify(existingData, null, 2);
    await writeFile("static/data/arrivalsAmsterdam.json", updatedJson, "utf8");

    return new Response(JSON.stringify(mappedData));
}
