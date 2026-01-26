import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  // تفعيل CORS للسماح للواجهة بالاتصال بالـ API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { title, video_url, ad_type, ad_content, company_name } = req.body;

  try {
    const client = await db.connect();
    
    // إدخال البيانات بناءً على أسماء الأعمدة في نيون
    await client.sql`
      INSERT INTO videos_table (title, video_url, ad_type, ad_content, company_name)
      VALUES (${title}, ${video_url}, ${ad_type}, ${ad_content}, ${company_name});
    `;

    return res.status(200).json({ success: true, message: "تم رفع الرابط بنجاح!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "فشل الاتصال بالقاعدة", details: error.message });
  }
}
