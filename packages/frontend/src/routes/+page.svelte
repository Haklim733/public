<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import mqtt from 'mqtt';
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
	let topic = `${data.appName}/${data.stage}/iot/${data.sessionId}`;
	topic = `${data.appName}/${data.stage}/iot/test`;
	console.log(topic);

	if (browser) {
		const client = createConnection(data.endpoint, data.authorizer);
		console.log(client.connected);
		client.on('connect', async () => {
			try {
				await client.subscribeAsync(topic, { qos: 1 });
				client.connect();
				console.log('connected');
			} catch (e) {
				console.log(e);
			}
		});
		client.on('message', (_fullTopic, payload) => {
			$msg = new TextDecoder('utf8').decode(new Uint8Array(payload));
			console.log($msg);
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
		<!-- <div class="box" style={`width: 10px`}>
			<label for="connect">Connect:</label>
			<!-- <button class="btn" on:click={connectToMqtt()}></button> -->
		<!-- </div> --> -->
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
