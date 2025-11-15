<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  export let hoornToAmsterdam = [];
  export let amsterdamToHoorn = [];

  onMount(() => {
    const filteredTrips = hoornToAmsterdam.filter((trip) => {
      const tripDateObject = new Date(trip.plannedDeparture);
      const tripYear = tripDateObject.getFullYear();
      const tripMonth = tripDateObject.getMonth();
      const tripDate = tripDateObject.getDate();
      return tripYear === 2025 && tripMonth === 10 && tripDate === 12;
    });

    filteredTrips.forEach((trip) => {
      const plannedDepartureObject = new Date(trip.plannedDeparture);
      trip.plannedDeparture = plannedDepartureObject;
    });

    filteredTrips.sort((trip1, trip2) => {
      return trip1.plannedDeparture - trip2.plannedDeparture;
    });

    function drawChart(filteredTrips) {
      const svg = document.querySelector("#delays");
      const svgWidth = svg.getBoundingClientRect().width;
      const barWidth = (svgWidth / filteredTrips.length) * 0.8;

      const xScale = d3
        .scaleTime()
        .domain([
          filteredTrips[0].plannedDeparture,
          filteredTrips[filteredTrips.length - 1].plannedDeparture,
        ])
        .range([0, svgWidth - barWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([-10, 60])
        .range([400, 0]);

        d3.select("#delays")
        .selectAll("rect")
        .data(filteredTrips)
        .join("rect")
        .attr("x", (d) => xScale(d.plannedDeparture))
        .attr("y", (d) => yScale(d.delay))
        .attr("width", barWidth)
        .attr("height", (d) => 400 - yScale(d.delay))
        .attr("fill", "steelblue");
    }

    drawChart(filteredTrips);

    addEventListener("resize", () => {
      drawChart(filteredTrips);
    });
  });
</script>

<section>
  <svg id="delays" width="600" height="400"></svg>
</section>

<style>
  section {
    border: 1px solid var(--border);
    padding: 1rem 1.5rem;
  }

  section svg {
    width: 100%;
  }
</style>
