export const stream = new sst.aws.KinesisStream("mockIotStream");

// Create a function subscribing to events of `bar` type
stream.subscribe("subscriber.ar", {
  filters: [
    {
      data: {
        type: ["AR"],
      },
    },
  ],
});
