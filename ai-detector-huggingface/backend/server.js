const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.post("/api/analyze", async (req, res) => {
  try {
    console.log("Request received");

    const { image } = req.body;

    const base64 = image.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const buffer = Buffer.from(base64, "base64");

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/ydshieh/vit-gpt2-coco-en",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/octet-stream"
        },
        body: buffer
      }
    );

    const data = await response.json();

    console.log(data);

    res.json(data);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Backend failed"
    });
  }
});

app.listen(5000, () =>
  console.log("Server running on 5000")
);