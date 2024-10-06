<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { Resource } from 'sst';
	import mqtt from 'mqtt';
	import { writable } from 'svelte/store';

	export let data: PageData;
	const { form, enhance } = superForm(data.form, {
		applyAction: true,
		invalidateAll: false,
		resetForm: false
	});
	let number = 0;

	function createConnection(endpoint: string, authorizer: string) {
		return mqtt.connect(`wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizer}`, {
			protocolVersion: 5,
			manualConnect: true,
			username: '', // Must be empty
			password: Resource.RT_TOKEN.value,
			clientId: `client_${window.crypto.randomUUID()}`
		});
	}

	const client = writable<any | null>(null);
	let messages = [];
	let topic = `${Resource.App.name}/${Resource.App.stage}/iot/${data.sessionId}`;
	console.log(topic);

	if (browser) {
		$client = createConnection(Resource.IotServer.endpoint, Resource.IotServer.authorizer);
		$client.on('connect', () => {
			console.log('Connected to MQTT broker');
		});
		$client.subscribe(`${topic}`, { qos: 2 }, (error) => {
			if (error) {
				console.error('Error subscribing to topic:', error);
			} else {
				console.log('Subscribed to topic: my/topic');
			}
		});
		$client.on('message', (topic, message) => {
			const msg = message.toString();
			console.log(message);
			messages = [...messages, `Topic: ${topic}, Message: ${msg}`];
		});
	}
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
		{messages}
	</div>
	<div>
		<h2>Streamed Data</h2>
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
