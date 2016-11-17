require('babel-core/register')({
  ignore: /node_modules/
});

const hook = require('node-hook').hook;
hook('.scss', () => {});
hook('./firebase_config.js', () => {});
