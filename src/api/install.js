export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Bitrix при установке присылает auth-данные в body
  const { AUTH_ID, REFRESH_ID, member_id, expires } = req.body;

  console.log('=== УСТАНОВКА ПРИЛОЖЕНИЯ ===');
  console.log('AUTH_ID:', AUTH_ID);
  console.log('REFRESH_ID:', REFRESH_ID);
  console.log('member_id:', member_id);
  console.log('expires:', expires);

  // На реальном проекте — сохранить эти данные в базу, KV-хранилище или secrets

  res.status(200).send('OK');
}

