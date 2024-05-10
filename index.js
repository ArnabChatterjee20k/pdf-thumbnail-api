const express = require("express");
const { fromBuffer } = require("pdf2pic");
const app = express();
const port = 3000;
const sharp = require("sharp");

const options = {
  density: 100,
  saveFilename: "untitled",
  format: "png",
  width: 600,
  height: 600,
};

const cropOptions = {
  left: 0,
  top: 0,
  width: 600,
  height: 100,
};

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.post("/convert", async (req, res) => {
  const body = req.body;
  const { url: pdfUrl } = body;
  if (!pdfUrl) {
    return res.status(400).send("PDF URL is required");
  }

  try {
    const response = await fetch(pdfUrl);
    const pdfBuffer = await response.arrayBuffer();
    const convert = fromBuffer(Buffer.from(pdfBuffer), options);
    const pageToConvertAsImage = 1;

    const buffer = await convert(pageToConvertAsImage, {
      responseType: "buffer",
    });
    console.log("Page 1 is now converted as image");
    const croppedBuffer = await sharp(buffer.buffer)
      .extract(cropOptions)
      .toBuffer();
    res.set("Content-Type", "image/png");
    res.send(croppedBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error converting PDF to image");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
