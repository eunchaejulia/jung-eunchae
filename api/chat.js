const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    const reply = data?.generated_text || data[0]?.generated_text || "응답 없음";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ 서버 오류:", err);
    res.status(500).json({ error: "서버 오류 발생", detail: err.toString() });
  }
};