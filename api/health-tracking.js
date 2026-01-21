import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { user_id, category, value, note, rating } = req.body;

    try {
        // حفظ البيانات في الجدول الذي أنشأناه
        await sql`
            INSERT INTO health_tracking (user_id, category, numeric_value, text_note, rating_score)
            VALUES (${user_id}, ${category}, ${value}, ${note}, ${rating});
        `;
        
        // منطق التنبيهات المخصصة بناءً على البيانات
        let alertMessage = `تم حفظ بيانات ${category} بنجاح ✨`;
        
        // أمثلة لتنبيهات ذكية بناءً على المدخلات
        if (category === 'weightloss' && value > 0) alertMessage = "رقة تشجعكِ! استمري في متابعة أهدافكِ الصحية 🏃‍♀️";
        if (category === 'vitals' && value > 140) alertMessage = "تنبيه: القياس مرتفع قليلاً، حاولي أخذ قسط من الراحة 🌸";

        return res.status(200).json({ 
            success: true, 
            message: alertMessage 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "فشل في المزامنة مع قاعدة البيانات" });
    }
}
