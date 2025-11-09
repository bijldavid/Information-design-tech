import { readFile } from "fs/promises";

export async function GET() {

    const arrivalsHoorn = JSON.parse(await readFile("static/data/arrivalsHoorn.json"));
    const arrivalsAmsterdam = JSON.parse(await readFile("static/data/arrivalsAmsterdam.json"));
    const departuresHoorn = JSON.parse(await readFile("static/data/departuresHoorn.json"));
    const departuresAmsterdam = JSON.parse(await readFile("static/data/departuresAmsterdam.json"));

    const hoornToAmsterdamTrips = [];

    departuresHoorn.forEach(departure => {
        const departureTrainNumber = departure.trainNumber;
        const departureTime = new Date(departure.plannedDepartureTime);
        arrivalsAmsterdam.forEach(arrival => {
            const arrivingTrainNumber = arrival.trainNumber;
            const arrivalTime = new Date(arrival.plannedDepartureTime);

            const differenceInMinutes = (arrivalTime - departureTime) / 1000 / 60;

            if (departureTrainNumber === arrivingTrainNumber && differenceInMinutes < 60 && differenceInMinutes > 0) {
                const trip = {
                    trainNumber: departure.trainNumber,
                    plannedDeparture: departure.plannedDepartureTime,
                    actualDeparture: departure.actualDepartureTime,
                    plannedArrival: arrival.plannedArrivalTime,
                    actualArrival: arrival.actualArrivalTime,
                    delayMinutes: differenceInMinutes
                }
                hoornToAmsterdamTrips.push(trip);
            }
        })
    });

    const amsterdamToHoornTrips = [];

    departuresAmsterdam.forEach(departure => {
        const departureTrainNumber = departure.trainNumber;
        const departureTime = new Date(departure.plannedDepartureTime);
        arrivalsHoorn.forEach(arrival => {
            const arrivingTrainNumber = arrival.trainNumber;
            const arrivalTime = new Date(arrival.plannedDepartureTime);

            const differenceInMinutes = (arrivalTime - departureTime) / 1000 / 60;

            if (departureTrainNumber === arrivingTrainNumber && differenceInMinutes < 60 && differenceInMinutes > 0) {
                const trip = {
                    trainNumber: departure.trainNumber,
                    plannedDeparture: departure.plannedDepartureTime,
                    actualDeparture: departure.actualDepartureTime,
                    plannedArrival: arrival.plannedArrivalTime,
                    actualArrival: arrival.actualArrivalTime,
                    delayMinutes: differenceInMinutes
                }
                amsterdamToHoornTrips.push(trip);
            }
        })
    });

    return new Response(JSON.stringify({
        hoornToAmsterdamTrips,
        amsterdamToHoornTrips
    }));
}
