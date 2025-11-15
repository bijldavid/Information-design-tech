<script>
  export let data;
  
  import Details from "$lib/components/Details.svelte";
  import Form from "$lib/components/Form.svelte";
  import Charts from "$lib/components/Charts.svelte";
</script>

<section>
  <h2 class="visually-hidden">Titel voor deze section</h2>

  <Details />
  <Form />
  <Charts hoornToAmsterdam={data.hoornToAmsterdam} amsterdamToHoorn={data.amsterdamToHoorn} />
</section>

<style>
  section {
    max-width: 1200px;
    margin-inline: auto;
    display: grid;
    grid-template-columns: max-content 2fr 1fr;
    gap: 2rem;
    padding-inline: 1rem;
    height: 70vh;
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