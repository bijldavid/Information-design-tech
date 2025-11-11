<script>
	import Header from '$lib/components/Header.svelte';
	import Details from '$lib/components/Details.svelte';
	import Form from '$lib/components/Form.svelte';
	let { children } = $props();
  
</script>
  
<Header />

<section>
	<h2 class="visually-hidden">Titel voor deze section</h2>
<Details />
<Form />
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
		height: 70vh;
	}

	section > div {
		width: 100%;
		height: 100%;
		background: red;
	}

	@media (width < 800px) {
		section {
			height: auto;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>