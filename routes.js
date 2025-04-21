const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
var db = require("./db");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const blockedExtensions = [
  ".exe",
  ".bat",
  ".sh",
  ".js",
  ".php",
  ".py",
  ".cmd",
  ".scr",
  ".vbs",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (blockedExtensions.includes(ext)) {
    return cb(new Error("Файл с таким расширением запрещён!"), false);
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post("/upload", upload.single("document"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не был передан" });
    }

    const fileName = req.file.filename;

    const fileInfo = {
      path: `/files/${fileName}`,
      name: fileName,
    };

    res.status(200).json({ message: "Файл успешно загружен", fileInfo });
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error);
    res.status(500).json({
      error: "Произошла ошибка при загрузке файла",
      details: error.message,
    });
  }
});

router.get("/api/get_processes", async function (req, res) {
  try {
    let data = await db.query_await(`select * from processes`);
    console.log(data);
    res.status(200).json({ data: data.recordset });
  } catch (error) {
    console.error("Error in /api/get_processes:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_emloyees", async function (req, res) {
  try {
    let data = await db.query_await(`select * from emloyees`);
    console.log(data);
    res.status(200).json({ data: data.recordset });
  } catch (error) {
    console.error("Error in /api/get_emloyees:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_docs_close", async function (req, res) {
  try {
    let data = await db.query_await(`select * from docs_close`);
    console.log(data);
    res.status(200).json({ data: data.recordset });
  } catch (error) {
    console.error("Error in /api/get_docs_close:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_docs_soglosovanie", async function (req, res) {
  try {
    let data = await db.query_await(`select * from docs_soglosovanie`);
    console.log(data);
    res.status(200).json({ data: data.recordset });
  } catch (error) {
    console.error("Error in /api/get_docs_soglosovanie:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_docs_vyplata", async function (req, res) {
  try {
    let data = await db.query_await(`select * from docs_vyplata`);
    console.log(data);
    res.status(200).json({ data: data.recordset });
  } catch (error) {
    console.error("Error in /api/get_docs_vyplata:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_docs_zakup", async function (req, res) {
  try {
    let data = await db.query_await(`select * from docs_zakup`);
    console.log(data);
    res.status(200).json({ data: data.recordset });
  } catch (error) {
    console.error("Error in /api/get_docs_zakup:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.get("/api/get_docs_contragent", async function (req, res) {
  try {
    let data = await db.query_await(`select * from docs1_contragent`);
    console.log(data);
    res.status(200).json({ data: data.recordset });
  } catch (error) {
    console.error("Error in /api/get_docs_contragent:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/add_processes", async function (req, res) {
  let { name, basic_processes } = req.body;
  try {
    await db.query_await(`exec add_processes '${name}','${basic_processes}'`);

    res.send({ status: 200, body: "success" });
  } catch (error) {
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/add_emloyee", async function (req, res) {
  let { fio, email, position, department, head_id, photo, phone_number } =
    req.body;
  try {
    await db.query_await(`exec add_emloyee 
        '${fio}',
        '${email}',
        '${position}',
        '${department}',
        '${head_id}',
        '${photo}',
        '${phone_number}'`);
    res.send({ status: 200, body: "success" });
  } catch (error) {
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/add_docs_close", async function (req, res) {
  const {
    name,
    basis_document,
    close_date,
    closing_documents,
    cover_sheet,
    close_status,
    comments,
    doc_id,
  } = req.body;

  try {
    await db.query_await(`
      exec add_docs_close 
        '${name}',
        '${basis_document}',
        '${close_date}',
        '${closing_documents}',
        '${cover_sheet}',
        '${close_status}',
        '${comments}',
        '${doc_id}'
    `);

    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error("Ошибка при вызове процедуры:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/add_docs_soglosovanie", async function (req, res) {
  const {
    contract_number,
    creation_date,
    contragent,
    contract_type,
    contract_file,
    validity_period,
    sum,
    approval_status,
    comments,
    doc_id,
  } = req.body;

  try {
    await db.query_await(`
      exec add_docs_soglosovanie 
        '${contract_number}',
        '${creation_date}',
        '${contragent}',
        '${contract_type}',
        '${contract_file}',
        '${validity_period}',
        '${sum}',
        '${approval_status}',
        '${comments}',
        '${doc_id}'
    `);

    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error("Ошибка при вызове процедуры:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/add_docs_vyplata", async function (req, res) {
  const {
    request_name,
    request_basis,
    contragent,
    sum,
    payment_date,
    budget,
    comments,
    doc_id,
  } = req.body;

  try {
    await db.query_await(`
      exec add_docs_vyplata 
        '${request_name}',
        '${request_basis}',
        '${contragent}',
        '${sum}',
        '${payment_date}',
        '${budget}',
        '${comments}',
        '${doc_id}'
    `);

    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error("Ошибка при вызове процедуры:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/add_docs_zakup", async function (req, res) {
  const {
    name,
    application,
    contragent,
    sum,
    budget,
    end_date,
    comments,
    doc_id,
  } = req.body;

  try {
    await db.query_await(`
      exec add_docs_zakup 
        '${name}',
        '${application}',
        '${contragent}',
        '${sum}',
        '${budget}',
        '${end_date}',
        '${comments}',
        '${doc_id}'
    `);

    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error("Ошибка при вызове процедуры:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

router.post("/api/add_docs_contragent", async function (req, res) {
  const {
    nameid_contragent,
    doc_id,
    company_name,
    inn,
    legal_address,
    actual_address,
    fio,
    phone,
    email,
    bank_details,
    verification_status,
  } = req.body;

  try {
    await db.query_await(`
      exec add_doc1 
        '${nameid_contragent}',
        '${doc_id}',
        '${company_name}',
        '${inn}',
        '${legal_address}',
        '${actual_address}',
        '${fio}',
        '${phone}',
        '${email}',
        '${bank_details}',
        '${verification_status}'
    `);

    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error("Ошибка при вызове процедуры:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
});

module.exports = router;
