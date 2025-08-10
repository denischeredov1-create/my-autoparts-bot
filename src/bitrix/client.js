const axios = require('axios');

async function callBitrix(method, params = {}) {
  const webhook = process.env.BITRIX_WEBHOOK;
  if (!webhook) {
    throw new Error("BITRIX_WEBHOOK is not set in environment variables");
  }
  const url = `${webhook}/${method}`;
  const { data } = await axios.post(url, params);
  return data;
}

module.exports = { callBitrix };
