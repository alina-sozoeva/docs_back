const db = require("../../../db");

exports.getEmloyees = async () => {
  const result = await db.query_await(`select * from emloyees`);
  return result.recordset;
};

exports.addEmloyees = async (data) => {
  const { fio, email, position, department, head_id, photo, phone_number } =
    data;
  await db.query_await(`exec add_emloyee 
        '${fio}',
        '${email}',
        '${position}',
        '${department}',
        '${head_id}',
        '${photo}',
        '${phone_number}'`);
};
