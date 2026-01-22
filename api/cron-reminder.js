import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // هذا الكود يبحث عن كل من سجلت 'menstruation' منذ 25 يوماً ولم يتم تذكيرها بعد
    try {
        const result = await sql`
            SELECT * FROM health_tracking 
            WHERE category = 'menstruation' 
            AND created_at <= NOW() - INTERVAL '25 days'
            AND reminder_sent = FALSE;
        `;

        for (const row of result.rows) {
            // هنا نرسل الإشعار (محاكاة لإرسال تنبيه للتطبيق)
            console.log(`تذكير للمستخدم ${row.user_id}: اقترب موعد دورتك القادمة ✨`);
            
            // تحديث السجل لكي لا يرسل التذكير مرة أخرى لنفس التاريخ
            await sql`
                UPDATE health_tracking 
                SET reminder_sent = TRUE 
                WHERE id = ${row.id};
            `;
        }

        return res.status(200).json({ success: true, reminded_count: result.rowCount });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
