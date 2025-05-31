import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...history.map(([user, assistant]) => [
            { role: "user", content: user },
            { role: "assistant", content: assistant },
          ]).flat(),
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}