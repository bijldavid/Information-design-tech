<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // props
  export let hoornToAmsterdam = [];
  export let amsterdamToHoorn = [];
  export let selectedDate = "2025-11-11";
  export let compareDate;
  export let isHoornToAmsterdam = false;

  export { className as class };

  let className = "";
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

  $: if (svg && (selectedDate || compareDate)) {
    shouldAnimate = true;
    filterAndDraw();
  }

  $: tripDirection = isHoornToAmsterdam ? hoornToAmsterdam : amsterdamToHoorn;

  $: if (svg && tripDirection) {
    shouldAnimate = true;
    filterAndDraw();
  }

  function filterTrips(trips, dateString) {
    if (!dateString) return [];

    const arrayDate = dateString.split("-");
    const year = Number(arrayDate[0]);
    const month = Number(arrayDate[1]);
    const date = Number(arrayDate[2]);

    const filteredTrips = trips.filter((trip) => {
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

    return filteredTrips;
  }

  function filterAndDraw() {
    const filteredA = filterTrips(tripDirection, selectedDate);
    const filteredB = filterTrips(tripDirection, compareDate);

    drawChart(filteredA, filteredB);
  }

  function timeOfDay(dateObj) {
    return new Date(
      0,
      0,
      0,
      dateObj.getHours(),
      dateObj.getMinutes(),
      dateObj.getSeconds()
    );
  }

  function drawChart(filteredA, filteredB) {
    const svgWidth = svg.getBoundingClientRect().width;
    const svgHeight = svg.getBoundingClientRect().height;

    const margin = { top: 25, right: 20, bottom: 25, left: 55 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const maxCount = Math.max(filteredA.length, filteredB.length);
    const barWidth = (chartWidth / 48) * 0.8;

    // Convert plannedDeparture → time-only values
    const filteredAtime = filteredA.map((d) => ({
      ...d,
      timeOnly: timeOfDay(d.plannedDeparture),
    }));

    const filteredBtime = filteredB.map((d) => ({
      ...d,
      timeOnly: timeOfDay(d.plannedDeparture),
    }));

    // x SCALE
    const startOfDay = new Date(0, 0, 0, 5, 0);
    const endOfDay = new Date(0, 0, 0, 24, 0);

    const xScale = d3
      .scaleTime()
      .domain([startOfDay, endOfDay])
      .range([margin.left, svgWidth - margin.right - barWidth]);

    // y SCALE
    const yScale = d3
      .scaleLinear()
      .domain([-5, 30])
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

    // drawing BAR A
    const barsA = d3
      .select(".bars-a")
      .selectAll("rect")
      .data(filteredAtime)
      .join("rect");

    const barsWithTransition = shouldAnimate
      ? barsA.transition().duration(500)
      : barsA;

    barsWithTransition
      .attr("x", (d) => xScale(d.timeOnly))
      .attr("y", (d) => {
        if (d.isCancelled) return margin.top;
        return d.delay >= 0 ? yScale(d.delay) : zeroY;
      })
      .attr("height", (d) => {
        if (d.isCancelled) return svgHeight - margin.top - margin.bottom;
        return Math.abs(yScale(d.delay) - zeroY);
      })
      .attr("width", barWidth)
      .attr("fill", "var(--NS-positive)")
      .attr("opacity", 0.5)
      .style("fill", (d) => {
        if (d.isCancelled) return "url(#diagonalHatch-positive)";
        return "var(--NS-positive)";
      });

    // drawing BAR B
    const barsB = d3
      .select(".bars-b")
      .selectAll("rect")
      .data(filteredBtime)
      .join("rect");

    const barsBWithTransition = shouldAnimate
      ? barsB.transition().duration(500)
      : barsB;

    barsBWithTransition
      .attr("x", (d) => xScale(d.timeOnly))
      .attr("y", (d) => {
        if (d.isCancelled) return margin.top;
        return d.delay >= 0 ? yScale(d.delay) : zeroY;
      })
      .attr("height", (d) => {
        if (d.isCancelled) return svgHeight - margin.top - margin.bottom;
        return Math.abs(yScale(d.delay) - zeroY);
      })
      .attr("width", barWidth)
      .attr("fill", "var(--NS-negative)")
      .attr("opacity", 0.5)
      .style("fill", (d) => {
        if (d.isCancelled) return "url(#diagonalHatch-negative)";
        return "var(--NS-negative)";
      });
  }
</script>

<section class={className}>
  <div class="svg-container">
    <svg id="delays" width="200" height="400">
      <defs>
        <pattern
          id="diagonalHatch-positive"
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="var(--NS-positive)"
            stroke-width="3"
          />
        </pattern>
        <pattern
          id="diagonalHatch-negative"
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="var(--NS-negative)"
            stroke-width="3"
          />
        </pattern>
      </defs>
      <g class="x-axis"></g>
      <g class="y-axis"></g>
      <g class="bars-a"></g>
      <g class="bars-b"></g>
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
