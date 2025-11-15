export async function load({ fetch }) {

    const res = await fetch("/api/delay-calculation");
    const data = await res.json();

    return {
        hoornToAmsterdam: data.hoornToAmsterdamTrips,
        amsterdamToHoorn: data.amsterdamToHoornTrips
    };
}
