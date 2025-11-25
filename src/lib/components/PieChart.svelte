<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  // Props vanuit de parent (Charts.svelte)
  // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  export let hoornToAmsterdam = [];
  export let amsterdamToHoorn = [];
  export let isHoornToAmsterdam = false;
  export let selectedCategory = "delay";

  let svgElement;

  // --------------------------------------------------------------------------------------------
  // Reactive statements
  // --------------------------------------------------------------------------------------------
  // -=-=-=-=-=- Ternary operator, isHoorn is een boolean -=-=-=-=-=-
  $: tripDirection = isHoornToAmsterdam ? hoornToAmsterdam : amsterdamToHoorn;

  // -=-=-=-=-=- Roept functie aan, tripDirection als argument -> reactive dependency -=-=-=-=-=-
  $: percentages = calculatePercentage(tripDirection);

  // -=-=-=-=-=- Roept functie aan, reactive statement met 3 reactive dependencies -=-=-=-=-=-
  $: if (svgElement && tripDirection && selectedCategory) {
    drawChart();
  }

  // --------------------------------------------------------------------------------------------
  // Alles binnen de onMount runned alleen wanneer het component ingeladen is
  // --------------------------------------------------------------------------------------------
  onMount(() => {
    svgElement = document.querySelector("#totals");

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Resize observer zorgt voor responsiveness
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const resizeObserver = new ResizeObserver(() => {
      drawChart();
    });

    resizeObserver.observe(svgElement);

    drawChart();
  });

  // --------------------------------------------------------------------------------------------
  // Hoeveelheid vertraagd & cancelled uit het totaal opslaan in variabele
  // --------------------------------------------------------------------------------------------
  function countTotal(trips) {
    const initialValue = 0;
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Reduce method om te tellen hoeveel treinen met vertraging er in de
    // data array voorkomen
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const totalDelaysInstances = trips.reduce(
      (accumulator, currentValue) => {
        if (currentValue.delay > 0) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      },
      initialValue
    );

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Reduce method om te tellen hoeveel gecancelde treinen er in de
    // data array voorkomen
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const totalCancelledInstances = trips.reduce(
      (accumulator, currentValue) => {
        if (currentValue.isCancelled === true) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      },
      initialValue
    );

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Simpele aftrek sommen om totaal niet vertraagde en gecancelde treinen
    // te berekenen
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const totalNoDelays = trips.length - totalDelaysInstances - totalCancelledInstances;
    const totalNotCancelled = trips.length - totalCancelledInstances;

    return {
      totalNoDelays,
      totalNotCancelled,
      totalDelaysInstances,
      totalCancelledInstances,
    };
  }

  // --------------------------------------------------------------------------------------------
  // Totaal hoeveelheden omrekenen naar percentages
  // --------------------------------------------------------------------------------------------
  function calculatePercentage(trips) {
    const totals = countTotal(trips);

    const percentageDelayed = totals.totalDelaysInstances / trips.length * 100;
    const percentageNotDelayed = 100 - percentageDelayed;

    const percentageCancelled = totals.totalCancelledInstances / trips.length * 100;
    const percentageNotCancelled = 100 - percentageCancelled;
    return {
      percentageCancelled,
      percentageNotCancelled,
      percentageDelayed,
      percentageNotDelayed
    }
  }

  // --------------------------------------------------------------------------------------------
  // Functie die de piechart bouwt
  // --------------------------------------------------------------------------------------------
  function drawChart() {
    const totals = countTotal(tripDirection);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Het return object van countTotal omzetten in gecategoriseerde objecten
    // binnen een array
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const pieDelayedData = [];
    pieDelayedData.push({ category: "On time", value: totals.totalNoDelays });
    pieDelayedData.push({ category: "Delayed", value: totals.totalDelaysInstances });

    const pieCancelledData = [];
    pieCancelledData.push({ category: "Not cancelled", value: totals.totalNotCancelled });
    pieCancelledData.push({ category: "Cancelled", value: totals.totalCancelledInstances });

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Algemene setup, maten bepalen
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    let svgWidth = svgElement.getBoundingClientRect().width;
    let svgHeight = svgElement.getBoundingClientRect().height;

    const margin = { top: 50, right: 25, bottom: 25, left: 25 };

    let chartWidth = svgWidth - margin.left - margin.right;
    let chartHeight = svgHeight - margin.top - margin.bottom;

    const radius = Math.min(chartWidth, chartHeight) / 2;

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // D3 pie generator
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value); // Waarde bepaalt de grootte van de slice

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // D3 arc generator - tekent de cirkelvormige segmenten
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Ternary operator om te bepalen welke data wordt getoont
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const dataToUse = selectedCategory === "delay" ? pieDelayedData : pieCancelledData;

    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    // Variabele aanmaken & <g> in het midden positioneren
    // -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    const svg = d3.select("#totals");
    const g = svg.select("g");
          g.attr("transform", `translate(${svgWidth / 2}, ${svgHeight / 2})`);
    



//                    █████████████                       
//               █████████████████████████              
//             █████           █████████████████        
//           █████         █████████       ███████      
//      █████████      ████████                █████    
//    ███████████    ██████       ███████       █████   
//   ████    ████    ███      ███████████████    ████   
//  ████     ████    ███ █████████       ████████████   
// ████      ████    ███████   ███████       ████████   
// ████      ████    ███           ███████       █████  
//  ████     ██████  ███           ███  ██████     ████ 
//   █████       ███████           ███    ████      ████
//    ████████       ███████   ███████    ████      ████
//    ████████████       █████████ ███    ████     ████ 
//    ████    ███████████████      ███    ████    █████ 
//    █████       ███████       ██████    ███████████   
//     █████                █████████     █████████     
//       ███████       █████████         █████          
//          ████████████████           █████            
//               █████████████████████████              
//                        █████████████                 


//               CODE BY CHATGPT (niet alles)
//                     ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

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
    <small>Visualizes all dates combined</small>
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
    background: color-mix(in srgb, var(--NS-negative) 50%, transparent 50%);
  }

  section .svg-container .labels small:nth-of-type(2) span {
    background: color-mix(in srgb, var(--NS-positive) 50%, transparent 50%);
  }

  section .svg-container > small {
    position: absolute;
    max-width: 15ch;
    text-wrap: nowrap;
    top: 3px;
    left: 3px;
    color: #666;
  }
</style>
