const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Inference API Error:", errorText);
      return res.status(response.status).json({ error: "Inference API failed", detail: errorText });
    }

    const data = await response.json();
    const text = data.generated_text || data[0]?.generated_text || "응답 없음";
    res.status(200).json({ text });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error", detail: err.toString() });
  }
};