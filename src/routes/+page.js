// --------------------------------------------------------------------------------------------
// (Load functie) Fetch de response van delay-calculations
// --------------------------------------------------------------------------------------------
export async function load({ fetch }) {

    const res = await fetch("/api/delay-calculation");
    const data = await res.json();

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // In deze load functie return ik de data uit delay-calc en geef ik ze mee
    // aan +page.svelte als props 
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    return {
        hoornToAmsterdam: data.hoornToAmsterdamTrips,
        amsterdamToHoorn: data.amsterdamToHoornTrips
    };
}
