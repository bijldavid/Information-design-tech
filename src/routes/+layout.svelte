<script>
	import Header from '$lib/components/Header.svelte';
	import Details from '$lib/components/Details.svelte';
	let { children } = $props();
  
</script>
  
<Header />

<section>
	<h2 class="visually-hidden">Titel voor deze section</h2>
<Details />
<div></div>
<div></div>
</section>
  
{@render children()}

<style>
	section {
		max-width: 1200px;
		margin-inline: auto;
		display: grid;
		grid-template-columns: max-content 2fr 1fr;
		gap: 2rem;
		padding-inline: 1rem;
	}

	section > div {
		width: 100%;
		height: 100%;
		background: red;
	}
</style>