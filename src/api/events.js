export const config = {
  api: {
    bodyParser: false, // читаем тело сами, чтобы не потерять form-urlencoded
  },
};

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const raw = await readRawBody(req);

  // Логи, которые мы ищем в Runtime Logs
  console.log('=== RAW BODY ===');
  console.log(raw);

  console.log('=== HEADERS ===');
  console.log(req.headers);

  // Пытаемся распарсить в объект
  let body = {};
  try {
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (ct.includes('application/json')) {
      body = JSON.parse(raw || '{}');
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(raw);
      for (const [k, v] of params.entries()) body[k] = v;
      if (typeof body.data === 'string') {
        try { body.data = JSON.parse(body.data); } catch {}
      }
    }
  } catch (e) {
    console.error('Ошибка парсинга:', e);
  }

  console.log('=== PARSED BODY ===');
  console.dir(body, { depth: null });

  // Быстрый ответ Bitrix, чтобы не таймаутился
  res.status(200).json({ ok: true });

  // Тест: пробуем отправить сообщение, если поля есть
  if (body?.event === 'ONIMBOTMESSAGEADD') {
    const dialogId = body?.data?.PARAMS?.DIALOG_ID;
    const botId = body?.data?.BOT?.ID || process.env.BOT_ID;
    if (dialogId && botId) {
      const resp = await fetch(`${process.env.BITRIX_WEBHOOK}imbot.message.add.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BOT_ID: botId,
          DIALOG_ID: dialogId,
          MESSAGE: 'Привет! Я тебя слышу 👍'
        }),
      });
      console.log('Bitrix API ответ:', await resp.text());
    }
  }
}
