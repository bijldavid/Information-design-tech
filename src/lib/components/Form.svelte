<script>
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();
  let selectedDate = "2025-11-11";
  let compareDate = null;

  function handleRouteChange(event) {
    dispatch("routeChange", event.target.checked);
  }

  function handleSelectedDateChange() {
    dispatch("changeDate", selectedDate);
  }

  function handleCompareDateChange() {
    dispatch("changeCompareDate", compareDate);
  }

  onMount(() => {
    const compareCheckbox = document.querySelector("#compare");
    const compareDateInput = document.querySelector("#compare-date");

    function updateState() {
      compareDateInput.classList.toggle("disabled", !compareCheckbox.checked);
    }

    compareCheckbox.addEventListener("change", () => {
      updateState();

      // Clear compare date when toggled off
      if (!compareCheckbox.checked) {
        compareDate = null;
        dispatch("changeCompareDate", null);
      }
    });

    updateState();
  });
</script>

<form action="">
  <fieldset>
    <legend>Select your rail route:</legend>

    <div>
      <label class="visually-hidden" for="origin-select"
        >This select allows you to change which rail route is visualised.</label
      >
      <div>
        <select id="origin-select">
          <option value="Hoorn">Enkhuizen</option>
          <option value="Uitgeest">Uitgeest</option>
          <option value="Den Helder">Den Helder</option>
        </select>
      </div>
      <label class="rail-route" for="rail-route">
        <input id="rail-route" type="checkbox" on:change={handleRouteChange} />
      </label>
      <p>Heerlen</p>
      <small>100+</small>
    </div>
  </fieldset>

  <hr />

  <fieldset>
    <legend>Choose a date to visualize.</legend>

    <label for="initial-date" class="visually-hidden"
      >Select your first date to visualize</label
    >
    <input
      id="initial-date"
      type="date"
      bind:value={selectedDate}
      on:change={handleSelectedDateChange}
    />

    <label for="compare"
      >Compare
      <input id="compare" type="checkbox" />
    </label>

    <label for="compare-date" class="visually-hidden"
      >Select a date to compare</label
    >
    <input
      id="compare-date"
      type="date"
      bind:value={compareDate}
      on:change={handleCompareDateChange}
    />
  </fieldset>

  <hr />

  <fieldset>
    <legend>Choose a category to visualize</legend>
    <div>
      <label for="total-delay">
        What % of trains get delayed
        <input id="total-delay" name="category" type="radio" checked/>
      </label>
      <label for="total-cancelled">
        What % of trains get cancelled
        <input id="total-cancelled" name="category" type="radio" />
      </label>
    </div>
  </fieldset>
</form>

<style>
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
  /* FORM  STYLES */
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  form {
    --checkbox-size: 12px;

    border: 1px solid var(--border);
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  fieldset {
    border: none;
  }

  fieldset legend {
    margin-bottom: 1rem;
  }

  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
  /* FIELDSET 1 */
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  fieldset:nth-of-type(1) > div {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    padding: 1rem;
    gap: 1rem;
  }

  fieldset:nth-of-type(1) > div:has(.rail-route input:checked) div {
    order: 3;
  }

  fieldset:nth-of-type(1) > div:has(.rail-route input:checked) p {
    order: 1;
  }

  fieldset:nth-of-type(1) > div div select {
    font-family: "gg-mono";
    appearance: none;
    background: var(--NS-gray-200);
    border: none;
    line-height: 1.4em;
    font-size: 1rem;
    padding-inline-end: 1.5rem;
  }

  fieldset:nth-of-type(1) > div div select:hover {
    cursor: pointer;
    background: var(--NS-gray-400);
  }

  fieldset:nth-of-type(1) > div div select:focus {
    outline: none;
  }

  fieldset:nth-of-type(1) > div div select:focus-visible {
    outline: 1px dashed var(--NS-blue);
  }

  fieldset:nth-of-type(1) > div div {
    position: relative;
    order: 1;
  }

  fieldset:nth-of-type(1) > div div::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0.5rem;
    translate: 0 -50%;
    height: 10px;
    aspect-ratio: 1;
    background-image: url(/static/assets/select-icon.svg);
    background-size: 80%;
    background-position: center 80%;
    background-repeat: no-repeat;
  }

  fieldset:nth-of-type(1) > div .rail-route {
    position: relative;
    width: min(225px, 100%);
    height: 1.5px;
    display: block;
    background: linear-gradient(
      90deg,
      var(--NS-gray-400) 0,
      transparent 30%,
      transparent 70%,
      var(--NS-gray-400) 100%
    );
    order: 2;
  }

  fieldset:nth-of-type(1) > div .rail-route::before,
  fieldset:nth-of-type(1) > div .rail-route::after {
    content: "";
    position: absolute;
    height: 10px;
    width: 10px;
    background: var(--NS-gray-400);
    translate: 0 -50%;
    top: 50%;
  }

  fieldset:nth-of-type(1) > div .rail-route::before {
    left: -10px;
  }

  fieldset:nth-of-type(1) > div .rail-route::after {
    right: -10px;
  }

  fieldset:nth-of-type(1) > div .rail-route input {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;

    appearance: none;
    height: 16px;
    aspect-ratio: 1;
    background-color: var(--NS-gray-100);
    transition: rotate .3s ease;
  }

  fieldset:nth-of-type(1) > div .rail-route input:hover::after {
    transform: rotateY(180deg);
  }

  fieldset:nth-of-type(1) > div .rail-route input::after {
    position: absolute;
    content: "";
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    height: 100%;
    width: 100%;
    background-image: url(/static/assets/rail-route-icon2.svg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 75%;
    rotate: z 0;
    transition: 0.5s ease rotate, .3s ease transform;
  }

  fieldset:nth-of-type(1) > div .rail-route input:checked::after {
    rotate: z 180deg;
  }

  fieldset:nth-of-type(1) > div p {
    margin-inline-end: auto;
    order: 3;
  }

  fieldset:nth-of-type(1) > div small {
    position: relative;
    font-size: 0.65rem;
    padding-inline-start: 1rem;
    white-space: nowrap;
    order: 4;
  }

  fieldset:nth-of-type(1) > div small::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 0;
    translate: 0 -50%;
    height: calc(100% + (1rem * 2));
    width: 1px;
    background: var(--border);
  }

  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
  /* FIELDSET 2 */
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  form > fieldset:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  fieldset:nth-of-type(2) {
    display: flex;
    flex-direction: column;
  }

  fieldset:nth-of-type(2) label {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    width: max-content;
  }

  fieldset:nth-of-type(2) input[type="date"] {
    appearance: none;
    padding: 0.5rem;
    background: var(--NS-gray-200);
    border: none;
    width: max-content;
  }

  fieldset:nth-of-type(2) input[type="date"]:hover {
    background: var(--NS-gray-400);
  }

  fieldset:nth-of-type(2) input[type="date"]:focus {
    outline: 1px dashed var(--NS-blue);
  }

  fieldset:nth-of-type(2) label[for="compare"] {
    position: relative;
  }

  fieldset:nth-of-type(2) label[for="compare"]::before {
    position: absolute;
    content: "";
    top: 50%;
    left: calc(12px + 1rem);
    translate: 0 -50%;
    background-image: url(/static/assets/compare-icon.svg);
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
    height: 1rem;
    width: 1rem;
  }

  fieldset:nth-of-type(2) #compare-date {
    color: var(--border);
    background: transparent;
    outline: 1px solid var(--border);
  }

  fieldset:nth-of-type(2):has(#compare:checked) #compare-date {
    color: var(--text);
    background: var(--NS-gray-200);
    border: none;
    outline: none;
  }

  fieldset:nth-of-type(2) #compare-date::-webkit-calendar-picker-indicator {
    opacity: 0.3;
  }

  fieldset:nth-of-type(2):has(#compare:checked)
    #compare-date::-webkit-calendar-picker-indicator {
    opacity: 1;
  }

  fieldset:nth-of-type(2):has(#compare:checked) #compare-date:hover {
    background: var(--NS-gray-400);
  }

  fieldset:nth-of-type(2):has(#compare:checked) #compare-date:focus {
    outline: 1px dashed var(--NS-blue);
  }

  fieldset:nth-of-type(2) label input[type="checkbox"] {
    position: relative;
    order: -1;
    /* accent-color: var(--NS-yellow); */
    appearance: none;
    height: var(--checkbox-size);
    aspect-ratio: 1;
    border: 1px solid var(--border);
  }

  fieldset:nth-of-type(2) label input:checked::after {
    position: absolute;
    content: "";
    height: calc(var(--checkbox-size) / 2);
    aspect-ratio: 1;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    background: var(--NS-blue);
  }

  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
  /* FIELDSET 3 */
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  fieldset:nth-of-type(3) div {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  fieldset:nth-of-type(3) div label {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  fieldset:nth-of-type(3) div label input {
    position: relative;
    order: -1;
    appearance: none;
    height: var(--checkbox-size);
    aspect-ratio: 1;
    border: 1px solid var(--border);
    border-radius: 50%;
  }

  fieldset:nth-of-type(3) div label input:checked::after {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    height: calc(var(--checkbox-size) / 2);
    aspect-ratio: 1;
    background: var(--NS-blue);
    border-radius: 50%;
  }

</style>
