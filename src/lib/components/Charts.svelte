<script>
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Importeer componenten
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  import BarChart from "./BarChart.svelte";
  import PieChart from "./PieChart.svelte";

  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Props vanuit de parent (+page.svelte)
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  export let hoornToAmsterdam;
  export let amsterdamToHoorn;
  export let selectedDate;
  export let compareDate;
  export let isHoornToAmsterdam;
  export let className = "";
  export let selectedCategory;

  export { className as class };
</script>


<div class={className}>
  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <!-- Barchart component met props die ik meegeef -->
  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <BarChart
    class={className}
    {hoornToAmsterdam}
    {amsterdamToHoorn}
    {selectedDate}
    {compareDate}
    {isHoornToAmsterdam}
  />

  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <!-- PieChart component met props die ik meegeef -->
  <!-- -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - -->
  <PieChart
    class={className}
    {hoornToAmsterdam}
    {amsterdamToHoorn}
    {isHoornToAmsterdam}
    {selectedCategory}
  />
</div>

<style>
  div {
    --chart-font-size: 12px;

    border: 1px solid var(--border);
    padding: 1rem 1.5rem;
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
  }
</style>
