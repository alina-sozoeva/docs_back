const express = require("express");
const router = express.Router();
const emloyeesController = require("../../controllers/employees/employees.controller");

router.get("/get_emloyees", emloyeesController.getEmloyees);
router.post("/add_emloyee", emloyeesController.addEmloyee);

module.exports = router;
