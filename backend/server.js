import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

// Endpoint لتحليل الصورة
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    console.log("🔍 Received image upload");
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // تحويل الصورة إلى Base64 (للاستخدام لاحقًا)
    const imgBuffer = req.file.buffer.toString("base64");

    // ⚡ التجربة: إرسال نتيجة وهمية بدل استدعاء OpenAI
    const fakeResult = `عمر الدجاجة المتوقع: 6 أسابيع، الوزن المتوقع: 1.2 كغ`;

    // إرسال النتيجة إلى الواجهة
    res.json({ result: fakeResult });

    // إذا أردت لاحقًا تفعيل OpenAI، يمكنك استبدال الجزء أعلاه بهذا:
    /*
    import fetch from "node-fetch";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You analyze chicken age & weight" },
          {
            role: "user",
            content: [
              { type: "input_text", text: "Estimate chicken age & weight" },
              { type: "input_image", image_url: `data:image/jpeg;base64,${imgBuffer}` }
            ]
          }
        ]
      })
    });

    const result = await response.json();
    res.json({ result: result.choices[0].message.content });
    */
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Middleware للخطأ العام
app.use((err, req, res, next) => {
  console.error("Server Error Middleware:", err);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log("AI Server running on http://localhost:3000"));
