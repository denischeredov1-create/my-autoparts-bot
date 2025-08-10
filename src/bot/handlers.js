const { log } = require('../utils/logger');

function handleMessage(message) {
  log(`Получено сообщение: ${message}`);
  return `Эхо: ${message}`;
}

module.exports = { handleMessage };
