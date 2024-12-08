<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { telemetry, waypoints, startLocation } from '$lib/store';
	import Map from '$lib/components/Map.svelte';
	// import MyChart from '$lib/components/TsChart.svelte';
	import DroneTable from '$lib/components/DroneTable.svelte';
	import MqttConnection from '$lib/connect';
	import type { DroneTelemetry, TelemetryResults } from '@public/core/src/drone';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import * as Form from '$lib/components/ui/form';
	import { iotFormSchema } from '@public/core/src/schema';
	import * as Alert from '$lib/components/ui/alert/index.ts';
	import { Card } from '$lib/components/ui/card/index.ts';

	let idleLimit = 3 * 60 * 1000; // x minutes
	let idleTimeout;
	let timedOut = false;
	let showResults = false;

	export let data: PageData;
	let res: Promise<TelemetryResults>;

	let startLocLong = $startLocation.lon;
	let startLocLat = $startLocation.lat;

	const form = superForm(data.droneForm, {
		applyAction: true,
		invalidateAll: false,
		resetForm: false,
		multipleSubmits: data.stage === 'prod' ? 'prevent' : 'allow',
		onSubmit: ({ formData, cancel }) => {
			const waypoints: { longitude: number; latitude: number }[] = $waypoints.map((marker) => {
				const { lng, lat } = marker.getLngLat();
				return { longitude: lng, latitude: lat };
			});
			const dataToSend = {
				startLocation: { longitude: startLocLong, latitude: startLocLat },
				waypoints: waypoints,
				speed: formData.get('speed'),
				sessionId: data.sessionId,
				service: 'drone'
			};

			console.log(JSON.stringify(waypoints));
			iotFormSchema.safeParse(dataToSend);
			res = streamIot(dataToSend);
			showResults = true;
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
			throw new Error('Publish Telemetry Error');
		}
		const fetchedData = await res.json();
		return fetchedData.data;
	}

	const { form: formData, enhance } = form;

	let topic = `${data.appName}/${data.stage}/iot/${data.sessionId}`;

	function connectMqtt(): MqttConnection.getClient {
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
			const telemetryData: DroneTelemetry = JSON.parse(msg);
			if (payload.dup) {
				console.log(`Received late message: ${msg}`);
			} else {
				console.log(telemetryData);
				telemetry.update((oldMessages) => [...oldMessages, telemetryData]);
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
		return client;
	}

	function resetIdleTimer(client) {
		clearTimeout(idleTimeout);
		startIdleTimer(client);
		if (!client.connected && timedOut) {
			const client = connectMqtt();
			client.connect();
		}
	}
	function startIdleTimer(client) {
		idleTimeout = setTimeout(() => {
			timedOut = true;
			if (client) {
				client.end();
			}
			console.log('idle too long, disconnected');
		}, idleLimit);
	}
	if (browser) {
		onMount(() => {
			const client = connectMqtt();
			client.connect();
			function trackUserActivity(client) {
				window.addEventListener('click', resetIdleTimer);
				window.removeEventListener('mousemove', resetIdleTimer);
				window.removeEventListener('touchstart', resetIdleTimer);
				window.removeEventListener('scroll', resetIdleTimer);
				startIdleTimer(client); // Start the initial timer
			}
			trackUserActivity(client);
			window.addEventListener('popstate', (state) => {
				if (state && window.location.href === window.location.href) {
					window.location.reload();
					mapComponent.map.render();
				}
				client.end();
			});
		});

		// window.addEventListener('beforeunload', () => {
		// 	isNavigatingAway = true;
		// 	client.end();
		// });
	}

	onDestroy(() => {});

	let mapComponent;

	function changeStart() {
		if (mapComponent) {
			mapComponent.recenter({ lat: startLocLat, lon: startLocLong, zoom: 17, pitch: 45 });
		}
	}
</script>

<div class="instructions">
	<h1>Test Drone Flight Telemetry with MQTT</h1>
	<Alert.Root>
		<Alert.Title>Instructions</Alert.Title>
		<Alert.Description
			>You can change the starting location by entering coordinates below. Click on the map to set
			waypoints and set speed of drone below. Click submit to see flight path and estimated
			distance. The telemetry data will also be streamed below.</Alert.Description
		>
	</Alert.Root>
	<div class="results">
		{#if res && showResults}
			{#await res then res}
				<Card>
					<h2>Results</h2>
					<p>Total Distance (meters): {res.totalDistance}</p>
				</Card>
			{:catch error}
				<p>Error: {error.message}</p>
			{/await}
		{/if}
	</div>
</div>

<div class="App">
	<div class="left-top-container">
		<Form.Field {form} name="startLong" class="width:50%;">
			<Form.Control let:attrs>
				<Form.Label>Start Location Longitude</Form.Label>
				<Input
					{...attrs}
					bind:value={startLocLong}
					type="number"
					min="5"
					max="60"
					placeholder="Enter 5-60"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="startLong" class="width:50%;">
			<Form.Control let:attrs>
				<Form.Label>Start Location Latitude</Form.Label>
				<Input
					{...attrs}
					bind:value={startLocLat}
					type="number"
					min="5"
					max="60"
					placeholder="Enter 5-60"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button on:click={() => changeStart()}>Change Start Location</Form.Button>
		<form method="POST" use:enhance>
			<Alert.Root>
				<Alert.Title>Enter speed of the drone below (m/s)</Alert.Title>
			</Alert.Root>
			<Form.Field {form} name="speed" class="width:50%;">
				<Form.Control let:attrs>
					<Input
						{...attrs}
						bind:value={$formData.speed}
						type="number"
						min="5"
						max="60"
						placeholder="Enter 5-60"
					/>
				</Form.Control>
				<Form.Description>*max duration of flight is limited to 20 seconds</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex justify-center gap-2">
				<Form.Button>Submit</Form.Button>
				<Button
					class="btn"
					name="clear"
					id="clear"
					on:click={() => {
						if (mapComponent) {
							mapComponent.clearMap();
						}
						telemetry.set([]);
						waypoints.set([]);
						res = undefined;
						showResults = false;
					}}
				>
					Reset
				</Button>
			</div>
		</form>
	</div>
	<div class="right-top-container">
		<Map bind:this={mapComponent} />
	</div>
	{#if $telemetry.length > 0}
		<div class="left-bottom-container">
			<h2>Streamed Data</h2>
			<DroneTable telemetryData={$telemetry} />
		</div>
	{/if}
</div>
