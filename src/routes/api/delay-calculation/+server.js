import { readFile } from "fs/promises";

// --------------------------------------------------------------------------------------------
// Trein vertragingen berekenen
// --------------------------------------------------------------------------------------------
export async function GET() {

    const arrivalsHoorn = JSON.parse(await readFile("static/data/arrivalsHoorn.json"));
    const arrivalsAmsterdam = JSON.parse(await readFile("static/data/arrivalsAmsterdam.json"));
    const departuresHoorn = JSON.parse(await readFile("static/data/departuresHoorn.json"));
    const departuresAmsterdam = JSON.parse(await readFile("static/data/departuresAmsterdam.json"));

    const hoornToAmsterdamTrips = [];

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Om de vertraging te kunnen berekenen moet ik de departure-tijd van Hoorn 
    // vergelijken met de arrival-tijd van de corresponderende trein in Amsterdam
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    departuresHoorn.forEach(departure => {
        const departureTrainNumber = departure.trainNumber;
        const departureTime = new Date(departure.plannedDepartureTime);
        arrivalsAmsterdam.forEach(arrival => {
            const arrivingTrainNumber = arrival.trainNumber;
            const arrivalTime = new Date(arrival.plannedArrivalTime);

            const differenceInMinutes = (arrivalTime - departureTime) / 1000 / 60;

            if (departureTrainNumber === arrivingTrainNumber && differenceInMinutes < 60 && differenceInMinutes > 0) {
                const trip = {
                    trainNumber: departure.trainNumber,
                    plannedDeparture: departure.plannedDepartureTime,
                    actualDeparture: departure.actualDepartureTime,
                    plannedArrival: arrival.plannedArrivalTime,
                    actualArrival: arrival.actualArrivalTime,
                    tripDuration: differenceInMinutes,
                    delay: (new Date(arrival.actualArrivalTime) - new Date(arrival.plannedArrivalTime)) / 1000 / 60,
                    isCancelled: arrival.isCancelled
                }
                hoornToAmsterdamTrips.push(trip);
            }
        })
    });

    const amsterdamToHoornTrips = [];

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Om de vertraging te kunnen berekenen moet ik de departure-tijd van 
    // Amsterdam vergelijken met de arrival-tijd van de corresponderende trein
    // in Hoorn
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    departuresAmsterdam.forEach(departure => {
        const departureTrainNumber = departure.trainNumber;
        const departureTime = new Date(departure.plannedDepartureTime);
        arrivalsHoorn.forEach(arrival => {
            const arrivingTrainNumber = arrival.trainNumber;
            const arrivalTime = new Date(arrival.plannedArrivalTime);

            const differenceInMinutes = (arrivalTime - departureTime) / 1000 / 60;

            if (departureTrainNumber === arrivingTrainNumber && differenceInMinutes < 60 && differenceInMinutes > 0) {
                const trip = {
                    trainNumber: departure.trainNumber,
                    plannedDeparture: departure.plannedDepartureTime,
                    actualDeparture: departure.actualDepartureTime,
                    plannedArrival: arrival.plannedArrivalTime,
                    actualArrival: arrival.actualArrivalTime,
                    tripDuration: differenceInMinutes,
                    delay: (new Date(arrival.actualArrivalTime) - new Date(arrival.plannedArrivalTime)) / 1000 / 60,
                    isCancelled: arrival.isCancelled
                }
                amsterdamToHoornTrips.push(trip);
            }
        })
    });

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Ik return een response met de 2 gevulde arrays 
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    return new Response(JSON.stringify({
        hoornToAmsterdamTrips, amsterdamToHoornTrips
    }));
}
