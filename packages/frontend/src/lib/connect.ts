// mqtt-connection.ts
import mqtt from 'mqtt';

class MqttConnection {
	private static instance: MqttConnection;
	private client: any;

	private constructor() {}

	public static getInstance(): MqttConnection {
		if (!MqttConnection.instance) {
			MqttConnection.instance = new MqttConnection();
		}
		return MqttConnection.instance;
	}

	public connect(endpoint: string, authorizer: string, sessionId: string, token: string): void {
		let url = `wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizer}`;

		this.client = mqtt.connect(url, {
			protocolVersion: 5,
			manualConnect: true,
			username: '', // Must be empty
			password: token,
			clientId: sessionId,
			clean: false,
			keepalive: 120,
			reconnectPeriod: 2000
		});
	}

	public getClient(): any {
		return this.client;
	}

	public disconnect(): void {
		if (this.client) {
			this.client.end();
		}
	}
}

export default MqttConnection;
