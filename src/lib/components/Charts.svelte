<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  export let hoornToAmsterdam = [];
  export let amsterdamToHoorn = [];
  export let selectedDate = "2025-11-11";

  export { className as class };

  let className = '';
  let svg;
  let shouldAnimate = false;

  onMount(() => {
    svg = document.querySelector("#delays");

    const resizeObserver = new ResizeObserver(() => {
      shouldAnimate = false;
      filterAndDraw();
    });

    resizeObserver.observe(svg);

    filterAndDraw();
  });

  $: if (svg && selectedDate) {
    shouldAnimate = true;
    filterAndDraw();
  }

  function filterAndDraw() {

    const arrayDate = selectedDate.split("-");
    const year = Number(arrayDate[0]);
    const month =  Number(arrayDate[1]);
    const date =  Number(arrayDate[2]);

    const filteredTrips = hoornToAmsterdam.filter((trip) => {
      const tripDateObject = new Date(trip.plannedDeparture);
      const tripYear = tripDateObject.getFullYear();
      const tripMonth = tripDateObject.getMonth();
      const tripDate = tripDateObject.getDate();
      return tripYear === year && tripMonth === month - 1 && tripDate === date;
    });

    filteredTrips.forEach((trip) => {
      const plannedDepartureObject = new Date(trip.plannedDeparture);
      trip.plannedDeparture = plannedDepartureObject;
    });

    filteredTrips.sort((trip1, trip2) => {
      if (trip1.plannedDeparture < trip2.plannedDeparture) {
        return -1;
      } else if (trip1.plannedDeparture > trip2.plannedDeparture) {
        return 1;
      } else {
        return 0;
      }
    });

    drawChart(filteredTrips);
  }

  function drawChart(filteredTrips) {
    const svgWidth = svg.getBoundingClientRect().width;
    const svgHeight = svg.getBoundingClientRect().height;

    const margin = { top: 25, right: 20, bottom: 25, left: 55 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const barWidth = (chartWidth / filteredTrips.length) * 0.7;

    // x SCALE
    const xScale = d3
      .scaleTime()
      .domain([
        filteredTrips[0].plannedDeparture,
        filteredTrips[filteredTrips.length - 1].plannedDeparture,
      ])
      .range([margin.left, svgWidth - margin.right - barWidth]);

    // y SCALE
    const yScale = d3
      .scaleLinear()
      .domain([-10, 20])
      .range([svgHeight - margin.bottom, margin.top]);

    const zeroY = yScale(0);

    // x AXIS
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeHour.every(3))
      .tickFormat(d3.timeFormat("%H:%M"));

    d3.select(".x-axis")
      .attr("transform", `translate(0, ${zeroY})`)
      .call(xAxis);

    // y AXIS
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(8)
      .tickFormat((d) => `${d}m`);

    d3.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // drawing BARS
    const bars = d3.select("#delays")
      .selectAll("rect")
      .data(filteredTrips)
      .join("rect");

    // Conditionally add transition
    const barsWithTransition = shouldAnimate 
      ? bars.transition().duration(500)
      : bars;

    barsWithTransition
      .attr("x", (d) => xScale(d.plannedDeparture))
      .attr("y", (d) => (d.delay >= 0 ? yScale(d.delay) : zeroY))
      .attr("height", (d) => Math.abs(yScale(d.delay) - zeroY))
      .attr("width", barWidth)
      .attr("fill", (d) =>
        d.delay >= 0 ? "var(--NS-negative)" : "var(--NS-positive)"
      );
  }
</script>


<section class={className}>
  <div class="svg-container">
    <svg id="delays" width="200" height="400">
      <g class="x-axis"></g>
      <g class="y-axis"></g>
    </svg>
    <small class="x-label">Delay in minutes →</small>
    <small class="y-label">Time in hours (1 day) →</small>
  </div>
</section>

<style>
  section {
    --chart-font-size: 12px;

    border: 1px solid var(--border);
    padding: 1rem 1.5rem;
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
  }

  section .svg-container {
    position: relative;
    overflow: hidden;
  }

  section .svg-container small {
    position: absolute;
    font-size: var(--chart-font-size);
    color: #666;
    white-space: nowrap;
  }

  section .svg-container .x-label {
    top: 10px;
    left: 0;
    rotate: z -90deg;
    translate: 8px 16ch;
    transform-origin: left;
  }

  section .svg-container .y-label {
    bottom: 0;
    right: 10px;
  }

  section .svg-container svg {
    width: 100%;
    height: calc(70vh / 2 - 1rem);
    background-color: var(--NS-gray-150);
  }
  

  :global * {
    font-family: "gg-mono";
  }

  :global(.x-axis text) {
    font-size: var(--chart-font-size);
    fill: #666;
  }

  :global(.x-axis path),
  :global(.x-axis line) {
    stroke: var(--border);
    /* stroke-dasharray: 2, 2; */
  }

  :global(.y-axis text) {
    font-size: var(--chart-font-size);
    fill: #666;
  }

  :global(.y-axis path),
  :global(.y-axis line) {
    stroke: var(--border);
    /* stroke-dasharray: 2, 2; */
  }

  :global(.y-axis .tick line) {
    stroke: var(--border);
  }
</style>
