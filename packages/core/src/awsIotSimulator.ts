// Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Script to generate simulated IoT device parameters data
// converted from python
import { randomInt, randomBytes } from 'crypto';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

const deviceNames = ['SBS01', 'SBS02', 'SBS03', 'SBS04', 'SBS05'];

// generate Flow values
function getFlowValues(): {
	deviceValue: number;
	deviceParameter: string;
	deviceId: string;
	dateTime: string;
} {
	const data: {
		deviceValue: number;
		deviceParameter: string;
		deviceId: string;
		dateTime: string;
	} = {
		deviceValue: randomInt(60, 100),
		deviceParameter: 'Flow',
		deviceId: deviceNames[Math.floor(Math.random() * deviceNames.length)],
		dateTime: new Date().toISOString()
	};
	return data;
}

// generate Temperature values
function getTemperatureValues(): {
	deviceValue: number;
	deviceParameter: string;
	deviceId: string;
	dateTime: string;
} {
	const data: {
		deviceValue: number;
		deviceParameter: string;
		deviceId: string;
		dateTime: string;
	} = {
		deviceValue: randomInt(15, 35),
		deviceParameter: 'Temperature',
		deviceId: deviceNames[Math.floor(Math.random() * deviceNames.length)],
		dateTime: new Date().toISOString()
	};
	return data;
}

// generate Humidity values
function getHumidityValues(): {
	deviceValue: number;
	deviceParameter: string;
	deviceId: string;
	dateTime: string;
} {
	const data: {
		deviceValue: number;
		deviceParameter: string;
		deviceId: string;
		dateTime: string;
	} = {
		deviceValue: randomInt(50, 90),
		deviceParameter: 'Humidity',
		deviceId: deviceNames[Math.floor(Math.random() * deviceNames.length)],
		dateTime: new Date().toISOString()
	};
	return data;
}

// generate Sound values
function getSoundValues(): {
	deviceValue: number;
	deviceParameter: string;
	deviceId: string;
	dateTime: string;
} {
	const data: {
		deviceValue: number;
		deviceParameter: string;
		deviceId: string;
		dateTime: string;
	} = {
		deviceValue: randomInt(0, 100),
		deviceParameter: 'Sound',
		deviceId: deviceNames[Math.floor(Math.random() * deviceNames.length)],
		dateTime: new Date().toISOString()
	};
	return data;
}
