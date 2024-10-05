import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";
import { message, superValidate } from 'sveltekit-superforms/server';

import type { PageServerLoad } from './$types';
import { iotFormSchema } from '@mockIot/core/src/iot.types';
import { zod } from 'sveltekit-superforms/adapters';
import { generateARVisionData } from "@mockIot/core/src/simulator";
import { Resource } from "sst";

export const load = (async ({locals}) => {
	const form = await superValidate(zod
    (iotFormSchema));
  
    async function minimalRespponse() {
    let resp = await fetch(`https://loripsum.net/generate.php?p=1&l=short`)
    return await resp.text()
}

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	streamIot: async ({ locals, request }) => {
		const formData = await request.formData();
    console.log(formData);
    console.log(Resource.mockIotStream.name);
    const client = new KinesisClient();
    for (let i = 0; i <= formData.get('number'); i++) {
      let iotData : string = btoa(JSON.stringify(generateARVisionData(`device${i}`)))
      let buffer = Buffer.from(iotData, 'base64');
      let input = new PutRecordCommand({
          StreamName: Resource.mockIotStream.name,
          Data: new Uint8Array(buffer),
          PartitionKey: `device${i}`
      });
      let res = await client.send(input);
      if (res.$metadata.httpStatusCode !== 200) {
          console.log(res);
          return { message: 'failed!' }  
      }
    }; 
      
  return {
    message: 'success!'
  };
  }
};