import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { user_id, category, value, note } = req.body;

    try {
        // 1. حفظ البيانات الصحية الأساسية
        await sql`
            INSERT INTO health_tracking (user_id, category, numeric_value, text_note)
            VALUES (${user_id}, ${category}, ${value}, ${note});
        `;

        // 2. طلب نصيحة من الذكاء الاصطناعي عبر GROQ
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "أنتِ طبيبة رقة، تطبيق لصحة المرأة. اكتبي نصيحة رقيقة ومختصرة جداً (سجل واحد فقط) بناءً على ما سجلته المستخدمة." },
                    { role: "user", content: `سجلتُ في فئة ${category} قيمة ${value}. ملاحظتي كانت: ${note}` }
                ]
            })
        });

        const aiData = await groqRes.json();
        const aiAdvice = aiData.choices[0].message.content;

        // 3. أمر كتابة الإشعار في جدول الإشعارات
        await sql`
            INSERT INTO notifications (user_id, body)
            VALUES (${user_id}, ${aiAdvice});
        `;

        return res.status(200).json({ success: true, message: "تم الحفظ وتوليد النصيحة الذكية" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "خطأ في المعالجة الذكية" });
    }
                }
