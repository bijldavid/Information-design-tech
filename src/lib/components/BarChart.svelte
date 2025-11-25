<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Props vanuit de parent (Charts.svelte)
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  export let hoornToAmsterdam = [];
  export let amsterdamToHoorn = [];
  export let selectedDate = "2025-11-11";
  export let compareDate;
  export let isHoornToAmsterdam = false;
  export let className = "";

  let svg;
  let shouldAnimate = false;

  // --------------------------------------------------------------------------------------------
  // Reactive statements
  // --------------------------------------------------------------------------------------------
  // -=-=-=-=-=- Ternary operator, isHoorn is een boolean -=-=-=-=-=-
  $: tripDirection = isHoornToAmsterdam ? hoornToAmsterdam : amsterdamToHoorn;

  // -=-=-=-=-=- Roept functie en veranderd shouldAnimate variabele waarde -=-=-=-=-=-
  $: if (svg && tripDirection && (selectedDate || compareDate)) {
  shouldAnimate = true;
  filterAndDraw();
  }

  // --------------------------------------------------------------------------------------------
  // Alles binnen de onMount runned alleen wanneer het component ingeladen is
  // --------------------------------------------------------------------------------------------
  onMount(() => {
    svg = document.querySelector("#delays");

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Resize observer zorgt voor responsiveness
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const resizeObserver = new ResizeObserver(() => {
      shouldAnimate = false;
      filterAndDraw();
    });

    resizeObserver.observe(svg);

    filterAndDraw();
  });

  // --------------------------------------------------------------------------------------------
  // Data klaarstomen voor gebruik in D3
  // --------------------------------------------------------------------------------------------
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Functie verwacht twee argumenten: een array met data & een datum als string
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  function filterTrips(trips, dateString) {
    if (!dateString) return [];

    const arrayDate = dateString.split("-");
    const year = Number(arrayDate[0]);
    const month = Number(arrayDate[1]);
    const date = Number(arrayDate[2]);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Trips bevat alle data van allerlij verschillende dagen, ik wil alleen de
    // data van de geselecteerde datum in het Form component
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const filteredTrips = trips.filter((trip) => {
      const tripDateObject = new Date(trip.plannedDeparture);
      const tripYear = tripDateObject.getFullYear();
      const tripMonth = tripDateObject.getMonth();
      const tripDate = tripDateObject.getDate();
      return tripYear === year && tripMonth === month - 1 && tripDate === date;
    });

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Ik zet de waarde van een key om naar een Date object zodat d3 ermee
    // kan werken
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    filteredTrips.forEach((trip) => {
      const plannedDepartureObject = new Date(trip.plannedDeparture);
      trip.plannedDeparture = plannedDepartureObject;
    });

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Ik sorteer de array op chronologische volgorde
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
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

  // --------------------------------------------------------------------------------------------
  // Filter trips op de gekozen datums en teken de grafiek opnieuw
  // --------------------------------------------------------------------------------------------
  function filterAndDraw() {
    const filteredAtrips = filterTrips(tripDirection, selectedDate);
    const filteredBtrips = filterTrips(tripDirection, compareDate);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Geeft beide gefilterde arrays door aan drawChart(), die de visualisatie
    // tekent met d3
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    drawChart(filteredAtrips, filteredBtrips);
  }

  // --------------------------------------------------------------------------------------------
  // Functie om datum om te zetten naar alleen dag-tijd (nodig voor de compare feature)
  // --------------------------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------------------------
  // Functie die de barchart bouwt
  // --------------------------------------------------------------------------------------------
  function drawChart(filteredA, filteredB) {

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Algemene setup, maten bepalen
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const svgWidth = svg.getBoundingClientRect().width;
    const svgHeight = svg.getBoundingClientRect().height;

    const margin = { top: 25, right: 20, bottom: 25, left: 55 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const barWidth = (chartWidth / 48) * 0.8;

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Ik voeg timeOnly als key toe aan de data met als waarde een datumloze tijd
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const filteredAtime = filteredA.map((d) => ({
      ...d,
      timeOnly: timeOfDay(d.plannedDeparture),
    }));

    const filteredBtime = filteredB.map((d) => ({
      ...d,
      timeOnly: timeOfDay(d.plannedDeparture),
    }));

    const startOfDay = new Date(0, 0, 0, 5, 0);
    const endOfDay = new Date(0, 0, 0, 24, 0);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // X scale aangemaakt (nodig voor de x-as)
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const xScale = d3
      .scaleTime()
      .domain([startOfDay, endOfDay])
      .range([margin.left, svgWidth - margin.right - barWidth]);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Y scale aangemaakt (nodig voor de y-as)
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const yScale = d3
      .scaleLinear()
      .domain([-5, 30])
      .range([svgHeight - margin.bottom, margin.top]);

    const zeroY = yScale(0); // Handige variabele om dingen op y hoogte 0 te positioneren

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // X-as aanmaken
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeHour.every(3))
      .tickFormat(d3.timeFormat("%H:%M"));

    d3.select(".x-axis")
      .attr("transform", `translate(0, ${zeroY})`)
      .call(xAxis);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Y-as aanmaken
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(8)
      .tickFormat((d) => `${d}m`);

    d3.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // De A bars aanmaken
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const barsA = d3
      .select(".bars-a")
      .selectAll("rect")
      .data(filteredAtime)
      .join("rect");

    const barsAWithTransition = shouldAnimate ? barsA.transition().duration(500) : barsA;

    barsAWithTransition
      .attr("x", (d) => xScale(d.timeOnly))
      .attr("y", (d) => {
        if (d.isCancelled) return margin.top;
        return d.delay >= 0 ? yScale(d.delay) : zeroY;
      })
      .attr("height", (d) => {
        if (d.isCancelled) return zeroY - margin.top;
        return Math.abs(yScale(d.delay) - zeroY);
      })
      .attr("width", barWidth)
      .attr("opacity", 0.7)
      .style("fill", (d) => {
        if (d.isCancelled) return "url(#diagonalHatch-positive)";
        return "var(--NS-blue-accent)";
      });

      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      // Tooltip op hover
      // BRON: https://codepen.io/dandevri/pen/azdrEQb?editors=1010
      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      barsA
        .on("mouseover touchstart", (e, d) => {
          const timeString = d3.timeFormat("%H:%M")(d.plannedDeparture);
          const tooltipText = d.isCancelled 
            ? `${timeString}: CANCELLED` 
            : `${timeString}: ${d.delay > 0 ? '+' : ''}${d.delay.toFixed(1)}m`; // geschreven met hulp van AI
          
          d3.select("#tooltip")
            .transition()
            .duration(175)
            .style("opacity", 1)
            .style("background", "var(--NS-blue-accent)")
            .style("color", "white")
            .text(tooltipText);
        })
        .on("mousemove", (e) => {
          d3.select("#tooltip")
            .style("left", e.pageX + 0 + "px")
            .style("top", e.pageY + 0 + "px");
        })
        .on("mouseout", () => {
          d3.select("#tooltip").style("opacity", 0);
        });

      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      // De B bars aanmaken
      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      const barsB = d3
        .select(".bars-b")
        .selectAll("rect")
        .data(filteredBtime)
        .join("rect");

      const barsBWithTransition = shouldAnimate ? barsB.transition().duration(500) : barsB;

      barsBWithTransition
        .attr("x", (d) => xScale(d.timeOnly))
        .attr("y", (d) => {
          if (d.isCancelled) return margin.top;
          return d.delay >= 0 ? yScale(d.delay) : zeroY;
        })
        .attr("height", (d) => {
          if (d.isCancelled) return zeroY - margin.top;
          return Math.abs(yScale(d.delay) - zeroY);
        })
        .attr("width", barWidth)
        .attr("opacity", 0.7)
        .style("fill", (d) => {
          if (d.isCancelled) return "url(#diagonalHatch-negative)";
          return "var(--NS-yellow)";
        });

      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      // Tooltip op hover
      // BRON: https://codepen.io/dandevri/pen/azdrEQb?editors=1010
      // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
      barsB
        .on("mouseover touchstart", (e, d) => {
          const timeString = d3.timeFormat("%H:%M")(d.plannedDeparture);
          const tooltipText = d.isCancelled 
            ? `${timeString}: CANCELLED` 
            : `${timeString}: ${d.delay > 0 ? '+' : ''}${d.delay.toFixed(1)}m`;
          
          d3.select("#tooltip")
            .transition()
            .duration(175)
            .style("opacity", 1)
            .style("background", "var(--NS-yellow)")
            .style("color", "var(--text)")
            .text(tooltipText);
        })
        .on("mousemove", (e) => {
          d3.select("#tooltip")
            .style("left", e.pageX + 0 + "px")
            .style("top", e.pageY + 0 + "px");
        })
        .on("mouseout", () => {
          d3.select("#tooltip").style("opacity", 0);
        });

      d3.select("body").on("touchend", () => {
        d3.select("#tooltip").style("opacity", 0);
      });
  }
</script>

<section class={className}>
  <h2 class="visually-hidden">
    This chart visualizes the delays on a select date
  </h2>
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
            stroke="var(--NS-blue-accent)"
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
            stroke="var(--NS-yellow)"
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
    <ul class="legend">
      <li>Train delay</li>
      <li>Compare train delay</li>
      <li>Cancelled</li>
    </ul>
  </div>
  <div id="tooltip"></div>
</section>

<style>
  section .svg-container {
    position: relative;
    overflow: hidden;
    height: calc(70vh / 2 - 2rem - 1px);
  }

  section .svg-container svg {
    width: 100%;
    height: 100%;
    background-color: var(--NS-gray-150);
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

  section .svg-container .legend {
    position: absolute;
    top: 3px;
    right: 3px;
    display: flex;
    flex-direction: column;
    align-items: end;
  }

  section .svg-container .legend li {
    position: relative;
    font-size: var(--chart-font-size);
    color: #666;
    width: max-content;
  }

  section .svg-container .legend li::before {
    position: absolute;
    content: '';
    top: 50%;
    left: -1.25rem;
    translate: 0 -50%;
    height: var(--chart-font-size);
    aspect-ratio: 1;
  }

  section .svg-container .legend li:nth-of-type(1)::before {
    background: color-mix(in srgb, var(--NS-blue-accent) 70%, transparent 30%);
  }

  section .svg-container .legend li:nth-of-type(2)::before {
    background: color-mix(in srgb, var(--NS-yellow) 70%, transparent 30%);
  }

  section .svg-container .legend li:nth-of-type(3)::before {
    background-image: url(/static/assets/cancelled.svg);
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
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
  }

  :global(.y-axis text) {
    font-size: var(--chart-font-size);
    fill: #666;
  }

  :global(.y-axis path),
  :global(.y-axis line) {
    stroke: var(--border);
  }

  :global(.y-axis .tick line) {
    stroke: var(--border);
  }

  #tooltip {
    position: absolute;
    background: var(--NS-gray-800);
    font-family: 'gg-mono';
    font-size: var(--chart-font-size);
    color: white;
    padding: .25rem .5rem;
    border-radius: 5px;
    opacity: 0;
    pointer-events: none;
    translate: -50% 50%;
    box-shadow: 5px 3px 14px -1px rgba(0,0,0,0.25);
  }
</style>
