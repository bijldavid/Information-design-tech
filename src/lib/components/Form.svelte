<script>
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();
  let selectedDate = "2025-11-11";
  let compareDate = null;

  function handleChange() {
    dispatch("changeDate", selectedDate);
  }

  function handleCompareDateChange() {
    dispatch("changeCompareDate", compareDate);
  }

  onMount(() => {
    const checkboxElement = document.querySelector("#compare");
    const compareDateElement = document.querySelector("#compare-date");

    function updateState() {
      compareDateElement.classList.toggle("disabled", !checkboxElement.checked);
    }

    checkboxElement.addEventListener("change", () => {
      updateState();

      // Clear compare date when toggled off
      if (!checkboxElement.checked) {
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
      <label class="visually-hidden" for="pet-select"
        >This select allows you to change which rail route is visualised.</label
      >
      <div>
        <select id="origin-select">
          <option value="Hoorn">Enkhuizen</option>
          <option value="Uitgeest">Uitgeest</option>
          <option value="Den Helder">Den Helder</option>
        </select>
      </div>
      <span class="rail-route"></span>
      <p>Heerlen2</p>
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
      on:change={handleChange}
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
</form>

<style>
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
  /* FORM  STYLES */
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

  form {
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

  fieldset:nth-of-type(1) > div select {
    font-family: "gg-mono";
    appearance: none;
    background: var(--NS-gray-200);
    border: none;
    line-height: 1.4em;
    font-size: 1rem;
    padding-inline-end: 1.5rem;
  }

  fieldset:nth-of-type(1) > div select:focus {
    outline: none;
  }

  fieldset:nth-of-type(1) > div div {
    position: relative;
  }

  fieldset:nth-of-type(1) > div div::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0.5rem;
    translate: 0 -50%;
    height: 10px;
    aspect-ratio: 1;
    background-image: url(./src/lib/assets/select-icon.svg);
    background-size: 80%;
    background-position: center 80%;
    background-repeat: no-repeat;
  }

  fieldset:nth-of-type(1) > div span {
    position: relative;
    width: min(225px, 100%);
    height: 22.5px;
    display: block;
    background-image: url(./src/lib/assets/rail-direction-icon.svg),
      linear-gradient(
        180deg,
        transparent 47%,
        var(--border) 47%,
        var(--border) 53%,
        transparent 53%
      );
    background-size: 12.5px, 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  fieldset:nth-of-type(1) > div span::before,
  fieldset:nth-of-type(1) > div span::after {
    content: "";
    position: absolute;
    height: 10px;
    width: 10px;
    background: var(--border);
    translate: 0 -50%;
    top: 50%;
  }

  fieldset:nth-of-type(1) > div span::before {
    left: -10px;
  }

  fieldset:nth-of-type(1) > div span::after {
    right: -10px;
  }

  fieldset:nth-of-type(1) > div p {
    margin-inline-end: auto;
  }

  fieldset:nth-of-type(1) > div small {
    position: relative;
    font-size: 0.65rem;
    padding-inline-start: 1rem;
    white-space: nowrap;
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
    padding: .5rem;
    background: var(--NS-gray-200);
    border: none;
    width: max-content;
  }

  fieldset:nth-of-type(2) input[type="date"]:focus {
    outline: 1px dashed var(--NS-blue);
  }

  fieldset:nth-of-type(2) label[for="compare"] {
    position: relative;
  }

  fieldset:nth-of-type(2) label[for="compare"]::before {
    position: absolute;
    content: '';
    top: 50%;
    left: calc(12px + 1rem);
    translate: 0 -50%;
    background-image: url(./src/lib/assets/compare-icon.svg);
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
    opacity: .3;
  }

  fieldset:nth-of-type(2):has(#compare:checked) #compare-date::-webkit-calendar-picker-indicator {
    opacity: 1;
  }

  fieldset:nth-of-type(2):has(#compare:checked) #compare-date:focus {
    outline: 1px dashed var(--NS-blue);
  }

  fieldset:nth-of-type(2) label input[type="checkbox"] {
    position: relative;
    order: -1;
    /* accent-color: var(--NS-yellow); */
    appearance: none;
    height: 12px;
    aspect-ratio: 1;
    border: 1px solid var(--border);
  }

  fieldset:nth-of-type(2) label input:checked::after {
    position: absolute;
    content: "";
    height: 6px;
    aspect-ratio: 1;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    background: var(--NS-blue);
  }
</style>
