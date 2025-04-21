const db = require("../../../db");

exports.getProcesses = async () => {
  const result = await db.query_await(`select * from processes`);
  return result.recordset;
};

exports.addProcess = async (name, basic_processes) => {
  await db.query_await(`exec add_processes '${name}','${basic_processes}'`);
};
