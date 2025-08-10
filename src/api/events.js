export const config = {
  api: {
    bodyParser: false, // отключаем встроенный парсер, чтобы не потерять form-urlencoded
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const raw = await readRawBody(req);

  console.log('=== RAW BODY ===');
  console.log(raw); // покажет тело запроса как прислал Bitrix

  console.log('=== HEADERS ===');
  console.log(req.headers);

  // Пробуем распарсить JSON и form-urlencoded
  let body;
  try {
    if ((req.headers['content-type'] || '').includes('application/json')) {
      body = JSON.parse(raw || '{}');
    } else {
      const params = new URLSearchParams(raw);
      body = {};
      for (const [k, v] of params.entries()) {
        body[k] = v;
      }
      if (typeof body.data === 'string') {
        try { body.data = JSON.parse(body.data); } catch {}
      }
    }
  } catch (e) {
    console.error('Ошибка парсинга тела:', e);
    body = {};
  }

  console.log('=== PARSED BODY ===');
  console.dir(body, { depth: null });

  // Отвечаем Bitrix сразу, чтобы не словить таймаут
  res.status(200).json({ ok: true });

  // Дальше твоя логика ответа
  if (body.event === 'ONIMBOTMESSAGEADD') {
    const dialogId = body?.data?.PARAMS?.DIALOG_ID;
    const botId = body?.data?.BOT?.ID || process.env.BOT_ID;
    if (dialogId && botId) {
      await fetch(`${process.env.BITRIX_WEBHOOK}imbot.message.add.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BOT_ID: botId,
          DIALOG_ID: dialogId,
          MESSAGE: 'Привет! Я тебя слышу 👍'
        })
      });
    }
  }
}
