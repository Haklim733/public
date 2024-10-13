<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { messages, waypoints } from '$lib/store';
	import SuperDebug from 'sveltekit-superforms';
	import Map from '$lib/components/Map.svelte';
	// import MyChart from '$lib/components/TsChart.svelte';
	import DroneTable from '$lib/components/DroneTable.svelte';
	import MqttConnection from '$lib/connect';
	import type { DroneTelemetryData, TelemetryResults } from '@mockiot/core/src/drone';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Card } from '$lib/components/ui/card/index';
	import * as Form from '$lib/components/ui/form';
	import { z } from 'zod';
	import { iotFormSchema } from '@mockIot/core/src/schema';

	let idleLimit = 1 * 60 * 1000; // x minutes
	let idleTimeout;

	export let data: PageData;
	let res: Promise<TelemetryResults>;

	const form = superForm(data.form, {
		applyAction: true,
		invalidateAll: false,
		resetForm: false,
		multipleSubmits: data.stage === 'prod' ? 'prevent' : 'allow',
		onSubmit: ({ formData, cancel }) => {
			const dataToSend = {
				waypoints: $waypoints,
				speed: formData.get('speed'),
				sessionId: data.sessionId,
				service: 'drone'
			};
			console.log(JSON.stringify(dataToSend));
			iotFormSchema.safeParse(dataToSend);
			res = streamIot(dataToSend);
			console.log(res);
			cancel();
		}
	});

	export async function streamIot(props): Promise<TelemetryResults> {
		const res = await fetch(data.publishEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(props)
		});
		if (!res.ok) {
			throw new Error('Network response was not ok');
		}
		const fetchedData = await res.json();
		return fetchedData.data;
	}

	const { form: formData, enhance } = form;

	let topic = `${data.appName}/${data.stage}/iot/${data.sessionId}`;

	if (browser) {
		onMount(() => {
			trackUserActivity();
		});

		function resetIdleTimer() {
			// clearTimeout(idleTimeout);
			startIdleTimer();
		}

		function trackUserActivity() {
			// window.addEventListener('mousemove', resetIdleTimer);
			// window.addEventListener('keydown', resetIdleTimer);
			// window.addEventListener('touchstart', resetIdleTimer);
			// window.addEventListener('scroll', resetIdleTimer);
			// startIdleTimer(); // Start the initial timer
			// console.log('startIdleTimer');
		}

		function startIdleTimer() {
			idleTimeout = setTimeout(() => {
				mqttConnection.disconnect();
				console.log('idle too long, disconnected');
			}, idleLimit);
		}
		const mqttConnection = MqttConnection.getInstance();
		mqttConnection.connect(data.endpoint, data.authorizer, data.sessionId, data.token);
		const client = mqttConnection.getClient();
		client.on('connect', () => {
			try {
				client.subscribe(topic, { qos: 1 }); // set to 1 works; 0 does not
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
			client.end();
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
		window.addEventListener('popstate', () => {
			mqttConnection.disconnect();
		});

		onDestroy(() => {
			// window.removeEventListener('mousemove', resetIdleTimer);
			// window.removeEventListener('keydown', resetIdleTimer);
			// window.removeEventListener('touchstart', resetIdleTimer);
			// window.removeEventListener('scroll', resetIdleTimer);
			// clearTimeout(idleTimeout); // Clear the idle timer
			// console.log('OnDestroy');
			// mqttConnection.disconnect();
		});
	}

	let mapComponent;
	let vizComponent;

	function clearMap() {
		if (mapComponent) {
			mapComponent.clearVectorSource();
		}
	}
	function clearViz() {
		if (vizComponent) {
			vizComponent.clearVizData();
		}
	}
	let latitude = 0;
	let longitude = 0;

	function setCoordinates(event) {
		if (mapComponent) {
			const { lat, lng } = mapComponent.map.latLngToLatLng(event.latlng);
			latitude = lat;
			longitude = lng;
		}
	}
</script>

<div class="App">
	<div class="left-top-container">
		<h1>Test Drone Flight Telemetry with MQTT</h1>
		<SuperDebug data={$formData} />
		<form method="POST" use:enhance>
			<Form.Field {form} name="speed" class="width:50%;">
				<Form.Control let:attrs>
					<Form.Label>Speed</Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.speed}
						type="number"
						min="5"
						max="60"
						placeholder="Enter 5-60"
					/>
				</Form.Control>
				<Form.Description>This is the speed of the drone (m/s)</Form.Description>
				<Form.Description>*max duration of flight is limited to 20 seconds</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button>Submit</Form.Button>
		</form>
		<div>
			<Button
				class="btn"
				name="clear"
				id="clear"
				on:click={() => {
					messages.set([]);
					clearMap();
					clearViz();
					waypoints.set([]);
					res = undefined;
				}}
			>
				Clear
			</Button>
		</div>
		<div class="results">
			{#if res}
				{#await res then res}
					<Card>
						<h2>Flight Summary</h2>
						<p>Total Time: {res.totalTime.toFixed(1)} seconds</p>
						<p>Total Distance: {res.totalDistance} meters</p>
					</Card>
				{:catch error}
					<p>Error: {error.message}</p>
				{/await}
			{/if}
		</div>
	</div>
	<div class="left-bottom-container">
		{#if $messages.length > 0}
			<h2>Streamed Data</h2>
			<DroneTable telemetryData={$messages} />
		{/if}
	</div>
	<div class="right-top-container">
		<div id="map" class="map">
			<Map bind:this={mapComponent} on:click={setCoordinates} />
		</div>
	</div>
</div>

<style>
	.App {
		height: 100%;
		width: 100%;
		display: grid;
		text-align: center;
		place-items: center;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr; /* Adjusted row sizes */
	}
	.left-top-container {
		grid-column: 1;
		grid-row: 1;
		display: grid;
		gap: 1%;
		padding: 2% 2%;
		overflow-y: auto;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		height: 100%;
		width: 80%;
		max-width: 100%;
	}
	.right-top-container {
		grid-column: 2;
		grid-row: 1;
		gap: 1%;
		padding: 2% 2%;
		height: 100%;
		width: 100%;
		max-width: 100%;
		max-height: 100%;
		align-items: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
	.left-bottom-container {
		grid-column: 1;
		grid-row: 2;
		gap: 1%;
		padding: 2% 4%;
		overflow-y: scroll;
		overflow-x: hidden;
		max-height: 100%;
		max-width: 100%;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
	.map {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.right-bottom-container {
		grid-column: 2;
		grid-row: 2;
		gap: 1%;
		padding: 2% 2%;
		height: 100%;
		width: 100%;
		align-items: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.message {
		display: block;
		overflow-wrap: break-word;
		word-wrap: break-word;
		hyphens: auto;
		text-align: justify;
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}
	.message:last-child {
		border-bottom: none;
	}
</style>
