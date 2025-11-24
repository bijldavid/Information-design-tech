<script>
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Ontvang de data uit +page.js als prop
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  export let data;

  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Importeer componenten
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  import Details from "$lib/components/Details.svelte";
  import Form from "$lib/components/Form.svelte";
  import Charts from "$lib/components/Charts.svelte";

  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // States met default waardes (nodig voor logica + reactieve data)
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  let selectedDate = "2025-11-11";
  let compareDate = null;
  let isHoornToAmsterdam = false;
  let selectedCategory = "delay";

  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Event handlers
  // Deze verwerken de custom events die door <Form /> worden verstuurd
  // en werken de lokale state bij zodat Charts opnieuw wordt gerenderd.
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  function handleRouteChange(event) {
    isHoornToAmsterdam = event.detail;
  }

  function handleDateChange(event) {
    selectedDate = event.detail;
  }

  function handleCompareDateChange(event) {
    compareDate = event.detail;
  }

  function handleCategoryChange(event) {
    selectedCategory = event.detail;
  }
</script>

<section>
  <h2 class="visually-hidden">Titel voor deze section</h2>

  <Details />

  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <!-- Deze activeren wanneer er een dispatch van binnen het form component komt -->
  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <Form
    on:changeRoute={handleRouteChange}
    on:changeDate={handleDateChange}
    on:changeCompareDate={handleCompareDateChange}
    on:changeCategory={handleCategoryChange}
  />

  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <!-- ... -->
  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <Charts
    class="charts"
    hoornToAmsterdam={data.hoornToAmsterdam}
    amsterdamToHoorn={data.amsterdamToHoorn}
    {isHoornToAmsterdam}
    {selectedDate}
    {compareDate}
    {selectedCategory}
  />
</section>

<style>
  section {
    max-width: 1300px;
    margin-inline: auto;
    display: flex;
    gap: 2rem;
    padding-inline: 1rem;
    padding-block-end: 1rem;
    height: 70vh;
  }

  section :global(details) {
    min-width: max-content;
  }

  section :global(form) {
    flex-basis: 65%;
    transition: flex-basis 0.3s ease;
  }

  section:has(:global(details[open])) :global(form) {
    flex-basis: 90%;
  }

  section :global(.charts) {
    flex-basis: 100%;
  }

  @media (width < 1225px) {
    section {
      height: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    section > :global(details) {
      grid-column: 1 / -1;
    }
  }

  @media (width < 800px) {
    section {
      height: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
