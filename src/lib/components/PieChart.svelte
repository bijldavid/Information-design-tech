<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // props
  export let hoornToAmsterdam = [];
  export let amsterdamToHoorn = [];
  export let isHoornToAmsterdam = false;
  export let selectedCategory = "delay";

  $: tripDirection = isHoornToAmsterdam ? hoornToAmsterdam : amsterdamToHoorn;

  $: percentages = calculatePercentage(tripDirection);

  let svgElement;

  onMount(() => {
    svgElement = document.querySelector("#totals");

    const resizeObserver = new ResizeObserver(() => {
      drawChart();
    });

    resizeObserver.observe(svgElement);

    drawChart();
  });

  $: if (svgElement && tripDirection && selectedCategory) {
    drawChart();
  }

  function countTotal(isHoornToAmsterdam) {
    const initialValue = 0;
    const totalDelaysInstances = isHoornToAmsterdam.reduce(
      (accumulator, currentValue) => {
        if (currentValue.delay > 0) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      },
      initialValue
    );

    const totalCancelledInstances = isHoornToAmsterdam.reduce(
      (accumulator, currentValue) => {
        if (currentValue.isCancelled === true) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      },
      initialValue
    );

    const totalNoDelays =
      isHoornToAmsterdam.length -
      totalDelaysInstances -
      totalCancelledInstances;

    const totalNotCancelled =
      isHoornToAmsterdam.length - totalCancelledInstances;

    return {
      totalNoDelays,
      totalNotCancelled,
      totalDelaysInstances,
      totalCancelledInstances,
    };
  }

  function calculatePercentage(isHoornToAmsterdam) {
    const totals = countTotal(isHoornToAmsterdam);

    const percentageDelayed = totals.totalDelaysInstances / isHoornToAmsterdam.length * 100;
    const percentageNotDelayed = 100 - percentageDelayed;

    const percentageCancelled = totals.totalCancelledInstances / isHoornToAmsterdam.length * 100;
    const percentageNotCancelled = 100 - percentageCancelled;
    return {
      percentageCancelled,
      percentageNotCancelled,
      percentageDelayed,
      percentageNotDelayed
    }
  }

  function drawChart() {
    const totals = countTotal(tripDirection);

    const pieDelayedData = [];
    pieDelayedData.push({ category: "On time", value: totals.totalNoDelays });
    pieDelayedData.push({
      category: "Delayed",
      value: totals.totalDelaysInstances,
    });

    const pieCancelledData = [];
    pieCancelledData.push({
      category: "Not cancelled",
      value: totals.totalNotCancelled,
    });
    pieCancelledData.push({
      category: "Cancelled",
      value: totals.totalCancelledInstances,
    });

    let svgWidth = svgElement.getBoundingClientRect().width;
    let svgHeight = svgElement.getBoundingClientRect().height;

    const margin = { top: 25, right: 25, bottom: 25, left: 25 };

    let chartWidth = svgWidth - margin.left - margin.right;
    let chartHeight = svgHeight - margin.top - margin.bottom;

    const radius = Math.min(chartWidth, chartHeight) / 2;

    // Set SVG dimensions
    d3.select("#totals").attr("width", chartWidth).attr("height", chartHeight);

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);
    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const dataToUse =
      selectedCategory === "delay" ? pieDelayedData : pieCancelledData;

    const svg = d3.select("#totals");
    const g = svg.select("g");
    g.attr("transform", `translate(${svgWidth / 2}, ${svgHeight / 2})`);

    const arcs = pie(dataToUse);
    const paths = g
      .selectAll("path")
      .data(arcs, (d, i) => i) // Use index as key so paths persist across category switches
      .join(
        (enter) =>
          enter
            .append("path")
            .each(function (d) {
              this._current = d; // Store current arc data for interpolation
            })
            .attr("fill", (d) => {
              if (d.data.category === "Cancelled") return "var(--NS-negative)";
              if (d.data.category === "Not cancelled")
                return "var(--NS-positive)";
              if (d.data.category === "Delayed") return "var(--NS-negative)";
              if (d.data.category === "On time") return "var(--NS-positive)";
            }),
        (update) =>
          update.each(function (d) {
            if (!this._current) this._current = d; // Initialize _current for existing paths
          })
      )
      .transition()
      .duration(500)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(this._current, d); // Smoothly interpolate between old and new arc
        this._current = interpolate(1); // Update _current to new value for next transition
        return (t) => arc(interpolate(t)); // Return function that generates arc at each step
      });
  }
</script>

<section>
  <h2 class="visually-hidden">
    This chart visualizes the total percentage of your selected category.
  </h2>
  <div class="svg-container">
    <svg id="totals" width="200" height="400">
      <g></g>
    </svg>
    <div class="labels">
      <small>
        <span>{selectedCategory === "delay" ? percentages.percentageDelayed.toFixed(0) : percentages.percentageCancelled.toFixed(0)}%</span>
        {selectedCategory === "delay" ? "delayed" : "cancelled"}
      </small>
      <small>
        <span>{selectedCategory === "delay" ? percentages.percentageNotDelayed.toFixed(0) : percentages.percentageNotCancelled.toFixed(0)}%</span>
        {selectedCategory === "delay" ? "on time" : "regular"}
      </small>
    </div>
  </div>
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

  section .svg-container .labels {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    display: grid;
  }

  section .svg-container .labels small {
    font-size: var(--chart-font-size);
    max-width: 20ch;
    text-align: center;
    text-wrap: balance;
  }

  section .svg-container .labels small:nth-of-type(1) span {
    background: var(--NS-negative);
  }

  section .svg-container .labels small:nth-of-type(2) span {
    background: var(--NS-positive);
  }
</style>
