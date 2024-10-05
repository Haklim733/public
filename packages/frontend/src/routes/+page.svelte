<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	export let data: PageData;
	const { form, enhance, reset } = superForm(data.form, {
		applyAction: true,
		invalidateAll: true,
		resetForm: false
	});
	let number = 0;
</script>

<div class="App">
	<div class="flex">
		<form method="POST" action="?/streamIot" use:enhance>
			<p>See Iot Graph</p>
			<div class="box" style={`width: ${number * 20}px; height: ${number * 20}px`}>
				<input type="number" min="1" max="5" bind:value={number} />
			</div>
			<div>
				<button type="submit" class="btn">Click to simulate iot Data feed!</button>
			</div>
		</form>
	</div>
	<div>
		<h2>Streamed Data</h2>
		{#await data.streamData}
			Loading ...
		{:then streamData}
			{@html streamData}
		{/await}
	</div>
</div>

<style>
	.App {
		height: 100vh;
		display: grid;
		text-align: center;
		place-items: center;
	}
	.box {
		width: 200px;
		height: 200px;
		background-color: lightgray;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	p {
		margin-top: 0;
		font-size: 20px;
	}
	button {
		font-size: 21px;
	}
</style>
