const emloyeeService = require("../../services/employees/emloyees.service");

exports.getEmloyees = async (req, res) => {
  try {
    const data = await emloyeeService.getEmloyees();
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in getProcesses:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
};

exports.addEmloyee = async (req, res) => {
  try {
    await emloyeeService.addEmloyees(req.body);
    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error("Error in addProcess:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
};
