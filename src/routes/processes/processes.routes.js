const express = require("express");
const router = express.Router();
const processController = require("../../controllers/processes/processes.controller");

router.get("/get_processes", processController.getProcesses);
router.post("/add_processes", processController.addProcess);

module.exports = router;
