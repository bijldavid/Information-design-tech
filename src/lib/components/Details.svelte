<script>
</script>

<details open>
  <summary><div class="details-icon"><span></span><span></span></div></summary>
  <section>
    <h2>Description</h2>
    <p>How it works.</p>
    <p>
      A brief explenation about what this filter entails to help the user better
      understand whether or not it is relevant for their data fetch.
    </p>
    <p>This is a 3 step process.</p>
    <ol role="list">
      <li>Do this</li>
      <li>Do that</li>
      <li>Click button</li>
    </ol>
    <p>
      Analyse the data, do note that the data collected is merely a sample of
      the actual data. Do not draw any conclusions from the charts created by
      this project
    </p>
  </section>
</details>

<style>
  details {
    --details-size: 400px;
  }

  details {
    border: 1px solid var(--border);
    display: flex;
    max-width: var(--details-size);
    overflow: hidden;
  }

  details::details-content {
    inline-size: 0;
    transition:
      inline-size 0.3s,
      content-visibility 0.3s allow-discrete;
  }

  details:open::details-content {
    inline-size: calc(var(--details-size) - 4rem);
  }

  details summary {
    position: relative;
    list-style: none;
    padding: 1rem;
    display: grid;
    place-items: center;
    height: 100%;
  }

  details summary::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 1px;
    border-right: 1px dashed var(--border);
    top: 0;
    right: -1px;
  }

  details summary .details-icon {
    position: relative;
    display: grid;
    place-items: center;
    height: 1rem;
    aspect-ratio: 1;
    transition: rotate 0.3s ease;
  }

  details summary:hover .details-icon {
    rotate: z 180deg;
  }

  details summary .details-icon span {
    position: absolute;
    display: block;
    height: 100%;
    width: 2px;
    background-color: var(--text);
  }

  details summary .details-icon span:nth-of-type(1) {
    rotate: z 0deg;
    transition: rotate 0.15s ease;
  }

  details[open] summary .details-icon span:nth-of-type(1) {
    rotate: z 90deg;
  }

  details summary .details-icon span:nth-of-type(2) {
    rotate: z 90deg;
  }

  details section {
    min-width: calc(var(--details-size) - 4rem);
  }

  details section h2 {
    font-size: 1rem;
    font-weight: normal;
    font-style: normal;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  details section p {
    padding: 1rem 1.5rem;
  }

  details section p:not(:last-of-type, :nth-of-type(3)) {
    border-bottom: 1px solid var(--border);
  }

  details section ol {
    padding: 1rem 1.5rem 1rem calc(28px + 1.5rem);
    border-bottom: 1px solid var(--border);
  }

  details section p:nth-of-type(1) {
    background: var(--NS-gray-200);
  }

  details section p:nth-of-type(3) {
    padding: 1rem 1.5rem 0 1.5rem;
  }

  @media (width < 800px) {
    details {
      --details-size: max-content;
    }

    details {
      flex-direction: column;
      min-width: 100%;
      overflow: hidden;
    }

    details::details-content {
      block-size: 0;
      min-width: 100%;
      transition:
        block-size 0.3s,
        content-visibility 0.3s allow-discrete;
    }

    details:open::details-content {
      block-size: var(--details-size);
      min-width: 100%;
    }

    details summary::after {
      height: 1px;
      width: 100%;
      border-bottom: 1px dashed var(--border);
      border-right: none;
      bottom: -1px;
      left: 0;
      top: auto;
      right: auto;
    }

    details section {
      min-height: var(--details-size);
      min-width: 100%;
    }
  }
</style>
