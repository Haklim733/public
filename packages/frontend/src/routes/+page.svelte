<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { messages, mapStore } from '$lib/store';
	import SuperDebug from 'sveltekit-superforms';
	import Map from '$lib/components/Map.svelte';
	import MqttConnection from '$lib/connect';
	import type { DroneTelemetryData } from '@mockiot/core/src/drone';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';

	export let data: PageData;

	const { form, enhance } = superForm(data.form, {
		applyAction: true,
		invalidateAll: false,
		resetForm: false,
		multipleSubmits: data.stage === 'prod' ? 'prevent' : 'allow',
		onSubmit: ({ formData, cancel }) => {
			console.log('submit');
			streamIot({
				duration: $form.duration,
				speed: $form.speed,
				sessionId: data.sessionId,
				service: 'drone'
			});
			cancel();
		}
	});

	let topic = `${data.appName}/${data.stage}/iot/${data.sessionId}`;

	if (browser) {
		// const client = createConnection(data.endpoint, data.authorizer);
		const mqttConnection = MqttConnection.getInstance();
		mqttConnection.connect(data.endpoint, data.authorizer, data.sessionId, data.token);
		const client = mqttConnection.getClient();
		client.on('connect', () => {
			try {
				client.subscribe(topic, { qos: 1 });
				console.log('connected to MQTT');
			} catch (e) {
				console.log(e);
			}
		});
		client.on('message', (_fullTopic, payload) => {
			let msg = new TextDecoder('utf8').decode(new Uint8Array(payload));
			const telemetryData: DroneTelemetryData = JSON.parse(msg);
			if (payload.dup) {
				console.log(`Received late message: ${msg}`);
			} else {
				messages.update((oldMessages) => [...oldMessages, telemetryData]);
			}
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

		window.addEventListener('beforeunload', () => {
			mqttConnection.disconnect();
		});
	}

	// streamIot.js
	export async function streamIot(props) {
		const res = await fetch(data.publishEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(props)
		});

		return await res.json();
	}

	let mapComponent;

	function clearMap() {
		if (mapComponent) {
			mapComponent.clearVectorSource();
		}
	}
</script>

<div class="App">
	<div class="left-top-container">
		<h1>Test Iot Telemetry</h1>
		<SuperDebug data={$form} />
		<form method="POST" use:enhance>
			<Label for="duration">Duration (0-60 seconds):</Label>
			<Input
				class="input-box"
				type="number"
				min="0"
				max="60"
				name="duration"
				id="duration"
				bind:value={$form.duration}
			/>
			<Label for="speed">Speed (m/s):</Label>
			<Input
				class="input-box"
				type="number"
				min="1"
				max="100"
				name="speed"
				id="speed"
				bind:value={$form.speed}
			/>
			<div>
				<Button class="btn">Click to simulate drone telemetry!</Button>
			</div>
		</form>
		<div>
			<Button
				class="btn"
				name="clear"
				id="clear"
				on:click={() => {
					messages.set([]);
					clearMap();
				}}
			>
				Clear telemetry!
			</Button>
		</div>
	</div>
	<div class="left-bottom-container">
		<h2>Streamed Data</h2>
		{#each $messages as item}
			<div class="message">{JSON.stringify(item)}</div>
		{/each}
	</div>
	<div class="right-top-container">
		<Map bind:this={mapComponent}></Map>
	</div>
	<div class="right-bottom-container"></div>
</div>

<style>
	.App {
		height: 100%;
		width: 100%;
		display: grid;
		text-align: center;
		place-items: center;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto 1fr;
	}
	.input-box {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
	.left-top-container {
		grid-column: 1;
		grid-row: 1;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		padding: 20px;
		overflow-y: auto;
	}
	.left-bottom-container {
		grid-column: 1;
		grid-row: 2;
		padding: 20px;
		overflow-y: scroll;
		height: 50vh;
		display: block;
	}
	.right-top-container {
		grid-column: 2;
		grid-row: 1;
		padding: 20px;
		height: 100%;
		width: 100%;
		align-items: center;
	}
	.right-bottom-container {
		grid-column: 2;
		grid-row: 2;
		padding: 20px;
	}

	#map {
		height: 100vh;
		width: 100vw;
		position: relative;
	}
	.message {
		display: block;
		overflow-wrap: break-word;
		word-wrap: break-word;
		hyphens: auto;
		max-width: 100%;
		width: 100%;
		text-align: justify;
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}
	.message:last-child {
		border-bottom: none;
	}
</style>
