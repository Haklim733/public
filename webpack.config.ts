const nodeExternals = require("webpack-node-externals");

module.exports = {
  // ...
  target: "node",
  externals: [
    nodeExternals({
      allowlist: [/^@aws-sdk/], // if you're using AWS SDK v3
    }),
  ],
  // ...
};
