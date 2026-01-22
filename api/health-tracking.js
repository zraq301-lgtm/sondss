import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { user_id, category, value, note } = req.body;

    try {
        // 1. حفظ البيانات في قاعدة بيانات Neon
        await sql`
            INSERT INTO health_tracking (user_id, category, numeric_value, text_note)
            VALUES (${user_id}, ${category}, ${value}, ${note});
        `;

        // 2. استدعاء الذكاء الاصطناعي GROQ لتوليد النصيحة
        let aiAdvice = `رقة سجلت لكِ ${category} بنجاح ✨`; // نص احتياطي في حال فشل الـ AI

        try {
            const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "mixtral-8x7b-32768", // موديل سريع وذكي
                    messages: [
                        { 
                            role: "system", 
                            content: "أنتِ طبيبة رقة، خبيرة في صحة المرأة العربية. وظيفتكِ تقديم نصيحة قصيرة جداً (لا تزيد عن 15 كلمة)، رقيقة، ومشجعة بناءً على البيانات الصحية التي تسجلها المستخدمة." 
                        },
                        { 
                            role: "user", 
                            content: `سجلتُ في فئة ${category} قياساً قدره ${value}. الملاحظة: ${note}. أعطني نصيحة رقيقة.` 
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await groqRes.json();
            if (data.choices && data.choices[0]) {
                aiAdvice = data.choices[0].message.content; // استلام نصيحة الذكاء الاصطناعي
            }
        } catch (err) {
            console.error("AI Error:", err);
        }

        // 3. حفظ النصيحة في جدول الإشعارات ليراها الجرس في الواجهة
        await sql`
            INSERT INTO notifications (user_id, title, body, type)
            VALUES (${user_id}, 'نصيحة رقة الذكية ✨', ${aiAdvice}, 'ai_advice');
        `;

        return res.status(200).json({ success: true, message: aiAdvice });

    } catch (error) {
        console.error("General Error:", error);
        return res.status(500).json({ error: "تعذر الحفظ" });
    }
        }
