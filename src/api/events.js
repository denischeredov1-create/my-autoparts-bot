export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const event = req.body.event;
  console.log('=== ПОЛУЧЕНО СОБЫТИЕ ===', event);

  if (event === 'ONIMBOTMESSAGEADD') {
    const message = req.body.data.MESSAGE;
    const dialogId = req.body.data.DIALOG_ID;

    console.log('Сообщение от пользователя:', message);

    // Отправляем ответ в чат
    try {
      const resp = await fetch(`${process.env.BITRIX_WEBHOOK}/imbot.message.add.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BOT_ID: process.env.BOT_ID,
          DIALOG_ID: dialogId,
          MESSAGE: `Привет! Ты написал: ${message}`
        })
      });

      const data = await resp.json();
      console.log('Ответ Bitrix24:', data);
    } catch (err) {
      console.error('Ошибка при отправке ответа:', err);
    }
  }

  res.status(200).send('OK');
}
