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
    };
  } else {
    data = {
      email: "",
      company_name: "",
      contacts: "",
    };
  }

  if (has_user_info(req)) {
    try {
      if (req.session.user_type === "personal") {
        const information = await db.promise().query(
          `select p.* from personal_info as p join 
           user_status as u on p.person_info_id = u.person_info_id
           where u.user_id = ?`,
          req.session.user_id
        );
        data.email = req.session.email;
        data.first_name = information[0][0].first_name;
        data.last_name = information[0][0].last_name;
        data.age = information[0][0].age;
        data.birthday = information[0][0].birthday;
        data.contacts = information[0][0].contact_info;
      } else {
        const information = await db.promise().query(
          `select c.* from company_info as c join 
            user_status as u on c.company_info_id = c.company_info_id
            where u.user_id = ?`,
          req.session.user_id
        );
        data.email = req.session.email;
        data.company_name = information[0][0].company_name;
        data.contacts = information[0][0].contact_info;
        console.log(information);
      }

      return res.status(201).json(data);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Server error, please try again later" });
    }
  } else {
    return res.status(201).json(data);
  }
});


router.post('/update', async(req, res) =>{
  let data = {};
  if (req.session.user_type === "personal") {
    data = {
      email: "",
      first_name: "",
      last_name: "",
      age: "",
      birthday: "",
      contacts: "",
    };
  } else {
    data = {
      email: "",
      company_name: "",
      contacts: "",
    };
  }
  
  if (has_user_info(req)) {

  }else{

  }

});


async function has_user_info(req) {
  try {
    const has_user_info = await db
      .promise()
      .query(
        `select * from user_status where user_id = ?`,
        req.session.user_id
      );
    return has_user_info;
  } catch (e) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
}

export default router;
