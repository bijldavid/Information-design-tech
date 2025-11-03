<script>
    let trains = [];

    async function loadTrains() {
        const response = await fetch('/api/trains');
        trains = await response.json();
    }

    loadTrains();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<style>

</style>