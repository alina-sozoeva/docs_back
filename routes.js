const express = require("express");
const router = express.Router();
var db = require("../db.js");
var config = require("../config");
const fs = require("fs");
const hbs = require("hbs");
var path = require("path");

router.post("/api/add_news", async function (req, res) {
  console;
  let { codeid, nameid, descr, date_publish, file } = req.body;
  try {
    console.log(
      `exec add_news '${codeid}','${nameid}','${descr}','${date_publish}','${file}' `
    );
    await db.query_await(
      `exec add_news '${codeid}','${nameid}','${descr}','${date_publish}','${file}' `
    );

    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/delete_news", async function (req, res) {
  let { codeid } = req.body;
  try {
    await db.query_await(`exec delete_news '${codeid}' `);
    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_news", async function (req, res) {
  try {
    let result = await db.query_await(
      `select * from db_news where deleted = 0`
    );
    // console.log(result, "result");
    res.send({ status: 200, body: result.recordset });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_news/:codeid", async function (req, res) {
  let codeid = req.params.codeid;
  try {
    let result = await db.query_await(
      `select * from db_news where deleted = 0 and codeid = '${codeid}'`
    );
    res.send({ status: 200, body: result.recordset });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/upload", (req, res) => {
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

    const fileName = Date.now() + ".jpg";
    const fileDir = path.join(__dirname, "..", "files");
    const filePath = path.join(fileDir, fileName);

    fs.writeFile(filePath, Buffer.concat(fileData), (err) => {
      if (err) {
        console.error("Ошибка при сохранении файла:", err);
        return res.status(500).send({
          status: 500,
          error: "Произошла ошибка при сохранении файла",
        });
      }

      const fileInfo = {
        path: `/files/${fileName}`,
        name: fileName,
      };
      console.log(fileInfo);

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
