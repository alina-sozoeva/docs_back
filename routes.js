const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
var db = require("./db");

const uploadDir = path.join(__dirname, "files");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.post("/api/upload_file", (req, res) => {
  let fileData = [];

  req.on("data", (chunk) => {
    fileData.push(chunk);
  });

  req.on("end", () => {
    if (fileData.length === 0) {
      return res
        .status(400)
        .send({ status: 400, error: "Файл не был загружен" });
    }

    const buffer = Buffer.concat(fileData);

    const fileName = Date.now() + ".jpg";
    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        return res
          .status(500)
          .send({ status: 500, error: "Ошибка при сохранении файла" });
      }

      const fileInfo = {
        path: `/files/${fileName}`,
        name: fileName,
      };
      console.log(typeof JSON.stringify(fileInfo));

      res.send({ status: 200, body: fileInfo });
    });
  });
  req.on("error", (err) => {
    console.error("Ошибка при загрузке файла:", err);
    res
      .status(500)
      .send({ status: 500, error: "Произошла ошибка при загрузке файла" });
  });
});

module.exports = router;
