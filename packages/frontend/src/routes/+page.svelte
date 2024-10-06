<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import mqtt from 'mqtt';
	import { writable } from 'svelte/store';
	import { msg } from '$lib/store';
	import SuperDebug from 'sveltekit-superforms';

	export let data: PageData;
	const { form, enhance } = superForm(data.form, {
		applyAction: true,
		invalidateAll: false,
		resetForm: false,
		multipleSubmits: 'allow',
		onSubmit: ({ formData, cancel }) => {
			formData.set('sessionId', data.sessionId);
			formData.set('devices', $form.devices);
			streamIot({ devices: $form.devices, sessionId: data.sessionId, service: 'iot' });
			cancel();
		}
	});

	function createConnection(endpoint: string, authorizer: string) {
		console.log(endpoint, authorizer);
		return mqtt.connect(`wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizer}`, {
			protocolVersion: 5,
			manualConnect: true,
			username: '', // Must be empty
			password: data.token,
			clientId: data.sessionId
		});
	}

	// const client = writable<any | null>(null);
	let messages = [];
	let topic = `${data.appName}/${data.stage}/iot/${data.sessionId}`;
	console.log(topic);

	// if (browser) {
	// 	const client = createConnection(data.endpoint, data.authorizer);
	// 	client.on('connect', async () => {
	// 		client.subscribe(`${topic}`, { qos: 2 }, (error) => {
	// 			if (error) {
	// 				console.error('Error subscribing to topic:', error);
	// 			} else {
	// 				console.log('Subscribed to topic: my/topic');
	// 			}
	// 		});
	// 	});
	// 	client.on('message', (topic, message) => {
	// 		console.log(message.toString());
	// 		messages = [...messages, `Topic: ${topic}, Message: ${$msg}`];
	// 	});
	// 	client.on('error', (error) => {
	// 		console.error('Error connecting to MQTT broker:', error);
	// 	});

	// 	client.publish(topic, 'Hello world!', { qos: 2 });
	// 	client.on('offline', () => {
	// 		console.log('Offline from MQTT broker');
	// 	});
	// 	client.on('close', () => {
	// 		console.log('Disconnected from MQTT broker');
	// 	});
	// }
	// streamIot.js
	export async function streamIot(props) {
		const res = await fetch('/api/mock', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(props)
		});

		return await res.json();
	}
</script>

<div class="App">
	<div class="flex">
		<SuperDebug data={$form} />
		<form method="POST" use:enhance>
			<p>See Iot Graph</p>
			<div class="box" style={`width: 10px`}>
				<label for="devices">Number:</label>
				<input type="number" id="devices" min="1" max="5" bind:value={$form.devices} />
			</div>
			<div>
				<button class="btn">Click to simulate iot Data feed!</button>
			</div>
		</form>
	</div>
	<div>
		<h2>Streamed Data</h2>
		{$msg}
	</div>
	<div>
		{messages}
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
