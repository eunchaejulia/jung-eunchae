export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      return res.status(500).json({ error: "Invalid response from HuggingFace" });
    }

    res.status(200).json({ result: data[0].generated_text });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
}