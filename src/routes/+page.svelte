<script>
  export let data;

  import Details from "$lib/components/Details.svelte";
  import Form from "$lib/components/Form.svelte";
  import Charts from "$lib/components/Charts.svelte";

  let selectedDate = "2025-11-11";

  function handleDateChange(event) {
    selectedDate = event.detail;
  }
</script>

<section>
  <h2 class="visually-hidden">Titel voor deze section</h2>

  <Details />
  <Form on:changeDate={handleDateChange} />
  <Charts
    class="charts"
    hoornToAmsterdam={data.hoornToAmsterdam}
    amsterdamToHoorn={data.amsterdamToHoorn}
    {selectedDate}
  />
</section>

<style>
  section {
    max-width: 1300px;
    margin-inline: auto;
    display: flex;
    gap: 2rem;
    padding-inline: 1rem;
    height: 70vh;
  }

  section :global(details) {
    min-width: max-content;
  }

  section :global(form) {
    flex-basis: 65%;
    transition: flex-basis .3s ease;
  }

  section:has(:global(details[open])) :global(form) {
    flex-basis: 85%;
  }

  section :global(.charts) {
    flex-basis: 100%;
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
