import express from "express";
import db from "./database.js";
import moment from "moment";

const router = express.Router();
//check age for future update

router.post("/", async (req, res) => {
  let { email, pass, con_pass, user_type } = req.body;

  if (!email || !pass || !con_pass || !user_type) {
    return res.status(400).json({ error: "Required fill input field" });
  }

  try {
    
    if (await Find_Email(email)) {
      return res.status(401).json({ error: "Email Already Exist" });
    }

    if (pass !== con_pass) {
      return res
        .status(401)
        .json({ error: "Password and confirm password do not match." });
    }
    const currentDate = moment().format("YYYY-MM-DD");

    await db
    .promise()
    .query(
      `INSERT INTO users (email, password, date_created, user_type) VALUES (?, ?, ?, ?)`,
      [email, pass, currentDate, user_type]
    );

    const user_id = await db
    .promise()
    .query(`select user_id from users where email = ?`, [email]);

    await db
    .promise()
    .query(
      `INSERT INTO user_status (user_id, person_info_id, company_info_id, subscription_type_id) VALUES (?, ?, ?, ?)`,
      [user_id[0][0].user_id, null, null, 1]
    );

    return res.status(201).json({ success: "Account Successfuly Created" });

  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
});

async function Find_Email(email) {
  const Find = await db
    .promise()
    .query(`select user_id from users where email = '${email}'`);

  if (!Find[0][0]) {
    console.log(false);
    return false;
  }
  console.log(true);
  return true;
}

export default router;
