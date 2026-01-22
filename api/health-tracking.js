import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const { user_id, category, value, note } = req.body;

    try {
        // 1. حفظ البيانات في Neon
        await sql`INSERT INTO health_tracking (user_id, category, numeric_value, text_note) 
                  VALUES (${user_id}, ${category}, ${value}, ${note});`;

        // 2. طلب نصيحة ذكية من GROQ باستخدام المفتاح المضاف حديثاً
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "أنتِ طبيبة رقة الذكية. قدمي نصيحة طبية رقيقة جداً ومختصرة بناءً على نوع الحالة والقياس المسجل." },
                    { role: "user", content: `الحالة: ${category}، القياس: ${value}، ملاحظتي: ${note}` }
                ]
            })
        });

        const data = await groqResponse.json();
        // جلب النص المولد بدلاً من النص الثابت
        const aiMessage = data.choices?.[0]?.message?.content || "رقة تهتم بكِ، استمري في المتابعة ✨";

        // 3. حفظ النصيحة المولدة في جدول الإشعارات
        await sql`INSERT INTO notifications (user_id, title, body, ai_provider) 
                  VALUES (${user_id}, 'نصيحة رقة الذكية', ${aiMessage}, 'groq');`;

        return res.status(200).json({ success: true, advice: aiMessage });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
