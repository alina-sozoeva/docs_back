const processService = require("../../services/processes/processes.service");

exports.getProcesses = async (req, res) => {
  try {
    const data = await processService.getProcesses();
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in getProcesses:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
};

exports.addProcess = async (req, res) => {
  const { name, basic_processes } = req.body;
  try {
    await processService.addProcess(name, basic_processes);
    res.send({ status: 200, body: "success" });
  } catch (error) {
    console.error("Error in addProcess:", error);
    res.status(500).send({ status: 500, error: error.message });
  }
};
