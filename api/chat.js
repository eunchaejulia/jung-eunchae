import fetch from 'node-fetch';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage } = await request.json();

  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await result.json();
    response.status(200).json({ reply: data.choices?.[0]?.message?.content || "응답 실패" });

  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}
