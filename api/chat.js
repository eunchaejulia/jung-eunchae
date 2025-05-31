import { fetch } from "undici";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: userMessage
      })
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      return res.status(response.status).json({ error: errorDetails });
    }

    const data = await response.json();
    const generatedText = data?.[0]?.generated_text || "응답이 없습니다.";

    res.status(200).json({ response: generatedText });

  } catch (error) {
    res.status(500).json({ error: error.message || "서버 에러 발생" });
  }
}