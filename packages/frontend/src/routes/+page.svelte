<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import mqtt from 'mqtt';
	import { msg } from '$lib/store';
	import SuperDebug from 'sveltekit-superforms';
	import Map from '$lib/components/Map.svelte';
	import { onMount } from 'svelte';
	// import { DroneTelemetryData } from '@mockiot/core/src/drone';

	export let data: PageData;

	let devices = 'drone';
	let devicesOptions = ['drone'];

	const { form, enhance } = superForm(data.form, {
		applyAction: true,
		invalidateAll: false,
		resetForm: false,
		multipleSubmits: data.stage === 'prod' ? 'prevent' : 'allow',
		onSubmit: ({ formData, cancel }) => {
			formData.set('sessionId', data.sessionId);
			formData.set('devices', $form.devices);
			streamIot({ devices: $form.devices, sessionId: data.sessionId, service: 'drone' });
			cancel();
		}
	});

	function createConnection(endpoint: string, authorizer: string) {
		let url = `wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizer}`;

		return mqtt.connect(url, {
			protocolVersion: 5,
			manualConnect: true,
			username: '', // Must be empty
			password: data.token,
			clientId: data.sessionId
		});
	}

	// const client = writable<any | null>(null);
	let messages = [];
	let lineFeatures = [];
	let topic = `${data.appName}/${data.stage}/iot/${data.sessionId}`;
	// topic = `${data.appName}/${data.stage}/iot/test`;

	if (browser) {
		const client = createConnection(data.endpoint, data.authorizer);
		client.on('connect', async () => {
			try {
				await client.subscribeAsync(topic, { qos: 1 });
				client.connect();
				console.log('connected to MQTT');
			} catch (e) {
				console.log(e);
			}
		});
		client.on('message', (_fullTopic, payload) => {
			$msg = new TextDecoder('utf8').decode(new Uint8Array(payload));
			messages = [...messages, `Topic: ${topic}, Message: ${$msg}`];
		});
		client.on('error', (error) => {
			console.error('Error connecting to MQTT broker:', error);
		});
		client.on('offline', () => {
			console.log('Offline from MQTT broker');
		});
		client.on('close', () => {
			console.log('Disconnected from MQTT broker');
		});
		client.connect();
		// }
		// function disconnectToMqtt() {
		// 	client.end();
		// }
	}
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

<div class="App" style="display: flex; height: 100vh; width: 100vw;">
	<div class="left-container" style="flex: 1; padding: 20px;">
		<SuperDebug data={$form} />
		<form method="POST" use:enhance>
			<p>Test Iot Telemetry</p>
			<div>
				<button class="btn">Click to simulate iot telemetry!</button>
			</div>
		</form>
	</div>
	<div class="right-container" style="flex: 1; padding: 20px 20px 0 20px; overflow-y: auto;">
		<div class="map-container" style="width: 100%; height: 300px; border: 1px solid black;">
			<Map {messages} />
		</div>
		<h2>Streamed Data</h2>
		<div class="message-container" style="max-height: 200px; overflow-y: auto;">
			{messages}
		</div>
	</div>
</div>

<style>
	.App {
		height: 100vh;
		display: grid;
		text-align: center;
		place-items: center;
	}
	p {
		margin-top: 0;
		font-size: 20px;
	}
	button {
		font-size: 21px;
	}
</style>
