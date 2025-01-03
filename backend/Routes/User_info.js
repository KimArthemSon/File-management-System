import express from "express";
import db from "./database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let data = {};
  if (req.session.user_type === "personal") {
    data = {
      email: "",
      first_name: "",
      last_name: "",
      age: "",
      birthday: "",
      contacts: "",
      user_type: "personal",
    };
  } else {
    data = {
      email: "",
      company_name: "",
      contacts: "",
      user_type: "company",
    };
  }

  try {
    const result = await has_user_info(req, res);

    if (result[0][0]) {
      if (req.session.user_type === "personal") {
        const information = await db.promise().query(
          `select p.* from personal_info as p join 
           user_status as u on p.person_info_id = u.person_info_id
           where u.user_id = ?`,
          [req.session.user_id]
        );

        // console.log(information);
        data.email = req.session.email;
        data.first_name = information[0][0].first_name;
        data.last_name = information[0][0].last_name;
        data.age = information[0][0].age;
        data.birthday = information[0][0].birthday;
        data.contacts = information[0][0].contact_info;
        // console.log(data);
        return res.status(201).json(data);
      } else {

        console.log(req.session.user_id)

        const information = await db.promise().query(
          `select c.* from company_info as c join 
            user_status as u on u.company_info_id = c.company_info_id
            where u.user_id = ?`,
          [req.session.user_id]
        );

        //console.log(information);
        data.email = req.session.email;
        data.company_name = information[0][0].company_name;
        data.contacts = information[0][0].contact_info;

        return res.status(201).json(data);
      }

    } else {
      return res.status(400).json({ error: "User not found" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
});

router.put("/update", async (req, res) => {
  let data = {};
  if (req.session.user_type === "personal") {
    const { email, first_name, last_name, age, birthday, contacts } = req.body;
    data = {
      email: email,
      first_name: first_name,
      last_name: last_name,
      age: age,
      birthday: birthday,
      contacts: contacts,
    };
  } else {
    const { email, company_name, contacts } = req.body;
    data = {
      email: email,
      company_name: company_name,
      contacts: contacts,
    };
  }

  try {

    const result = await has_user_info(req, res);

    if (result[0][0]) {
      if (req.session.user_type === "personal") {
        await db.promise().query(
          `update personal_info as p join user_status as u on p.person_info_id = u.person_info_id
          set p.first_name = ?, p.last_name = ?, p.age = ?, p.contact_info = ?
          where u.user_id = ?`,
          [
            data.first_name,
            data.last_name,
            data.age,
            data.contacts,
            req.session.user_id,
          ]
        );
      } else {
        await db.promise().query(
          `update company_info as c join user_status as u on c.company_info_id = u.company_info_id
        set c.company_name = ?, c.contact_info = ?
        where u.user_id = ?`,
          [data.company_name, data.contacts, req.session.user_id]
        );
        
      }
    } else {
      if (req.session.user_type === "personal") {
        await db
          .promise()
          .query(
            `insert into personal_info(first_name,last_name,age,birthday,contact_info) values(?,?,?,?,?)`,
            [
              data.first_name,
              data.last_name,
              data.age,
              data.birthday,
              data.contacts,
            ]
          );

        const [rows] = await db
          .promise()
          .query(`select LAST_INSERT_ID() from personal_info`);

        await db
          .promise()
          .query(
            `update user_status set person_info_id = ? where user_id = ?`,
            [rows[0]["LAST_INSERT_ID()"], req.session.user_id]
          );
      } else {
        await db
          .promise()
          .query(
            `insert into company_info(company_name,contact_info) values(?,?)`,
            [data.company_name, data.contacts]
          );

        const [rows] = await db.promise().query(`select LAST_INSERT_ID()`);

        await db
          .promise()
          .query(
            `update user_status set company_info_id = ? where user_id = ?`,
            [rows[0]["LAST_INSERT_ID()"], req.session.user_id]
          );
      }
    }

    return res.status(201).json({ success: "Successfuly updated" });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
});

async function has_user_info(req, res) {
  try {
    const has_userInfo = await db
      .promise()
      .query(
        `select * from user_status where user_id = ? and person_info_id is not null or company_info_id is not null and user_id = ?`,
        [Number(req.session.user_id), Number(req.session.user_id)]
      );

    return has_userInfo;
  } catch (e) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
}

export default router;
