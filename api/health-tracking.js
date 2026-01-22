import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { user_id, category, value, note } = req.body;

    try {
        // 1. الحفظ في Neon Postgres أولاً (الأساس)
        await sql`
            INSERT INTO health_tracking (user_id, category, numeric_value, text_note)
            VALUES (${user_id}, ${category}, ${value}, ${note});
        `;

        let finalAdvice = "تم حفظ بياناتك بنجاح في رقة ✨";

        // 2. محاولة جلب ذكاء اصطناعي من GROQ (المنصة الأولى)
        try {
            const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "mixtral-8x7b-32768",
                    messages: [{ role: "user", content: `أعطني نصيحة صحية لمستخدم سجل ${category} بقيمة ${value}` }]
                })
            });
            const data = await groqRes.json();
            if (data.choices && data.choices[0]) {
                finalAdvice = data.choices[0].message.content;
            }
        } catch (e) {
            console.log("GROQ failed, trying fallback...");
            // هنا يمكنك إضافة منطق للمنصة الثانية MXBAI إذا كانت تدعم الـ Chat
        }

        // 3. كتابة الإشعار النهائي في الجدول (ليظهر عند الجرس)
        await sql`
            INSERT INTO notifications (user_id, title, body)
            VALUES (${user_id}, 'تحديث من ذكاء رقة', ${finalAdvice});
        `;

        return res.status(200).json({ success: true, message: finalAdvice });

    } catch (error) {
        console.error("Critical Error:", error);
        return res.status(500).json({ error: "تعذر المعالجة، تأكدي من إعدادات Vercel" });
    }
}
