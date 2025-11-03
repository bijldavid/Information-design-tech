import { API_KEY } from '$env/static/private';

const url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=ASD";

async function getData() {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY
        }
    });

    return response.json();
}

export async function GET() {
    const data = await getData();
    return new Response(JSON.stringify(data));
}
