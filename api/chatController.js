// api/chatController.js - Groq AI Assistant Handler for Shatir Store ERP

export default async function handler(req, res) {
  // 1. السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, storeData } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message payload is required' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY environment variable is missing' });
  }

  // 2. تجميع وتنسيق بيانات المتجر الممررة من الواجهة
  const contextSummary = storeData ? `
بيانات المتجر الحالية المتاحة للاستعلام والتحليل:
- إجمالي عدد المنتجات: ${storeData.productCount ?? 'غير محدد'}
- قيمة المخزون الحالي: ${storeData.inventoryValue ?? 0}
- المنتجات قريبة من النفاد: ${storeData.lowStock ?? 0}
- إجمالي المبيعات: ${storeData.totalRevenue ?? 0}
- إجمالي المشتريات: ${storeData.totalPurchases ?? 0}
- ملخص آخر الفواتير/العمليات: ${JSON.stringify(storeData.recentInvoices || [], null, 2)}
` : 'لا توجد بيانات تفصيلية ممررة حالياً، قم بالرد بناءً على أسئلة المستخدم العامة.';

  // 3. صياغة التوجيه النظامي (System Prompt)
  const systemPrompt = `
أنت مساعد ذكاء اصطناعي خبير ومستشار مالي وإداري لتطبيق "شاطر" لإدارة المحلات والمخازن.
مهمتك:
1. تحليل حركة المبيعات والمشتريات والمخزون والإجابة على استفسارات صاحب المحل بدقة.
2. تقديم نصائح لتجميع الأرباح، تقليل الركود، وتنبيهه للمنتجات التي أوشكت على النفاد.
3. التحدث باللغة العربية بأسلوب مهني، مباشر، ومختصر.

بيانات النظام الحالية:
${contextSummary}
`;

  try {
    // 4. إرسال الطلب إلى Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });

    if (!groqResponse.ok) {
      const errData = await groqResponse.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Groq API returned status ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    const aiReply = data.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من إعداد الرد المناسب.';

    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('Error in chatController:', error);
    return res.status(500).json({ 
      error: 'فشل في معالجة طلب الذكاء الاصطناعي', 
      details: error.message 
    });
  }
}
