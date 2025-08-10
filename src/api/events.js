export default async function handler(req, res) {
  console.log('=== ПРИШЛО СОБЫТИЕ ===', req.method, req.body);

  if (req.method === 'POST' && req.body?.event === 'ONIMBOTMESSAGEADD') {
    const dialogId = req.body?.data?.PARAMS?.DIALOG_ID;
    const botId = req.body?.data?.BOT?.ID;
    if (dialogId && botId) {
      await fetch('https://b24-0vku01.bitrix24.ru/rest/1/irrrwyegnvf3obh6/imbot.message.add.json', {
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

  res.status(200).json({ ok: true });
}
