import express from "express";
import db from "./database.js";
import { getData } from "../LogicCrud/Retrieve.js";
import { validate } from "../LogicCrud/Validate.js";
import { deleteData } from "../LogicCrud/Delete.js";
import { updateData } from "../LogicCrud/Update.js";
import { createFolder, createFile, upload } from "../LogicCrud/Create.js";

const router = express.Router();

router.post("/create/:id", upload.single("file"), createFile);

router.get("/folders", async (req, res) => {
  let stmt = `select f.* from user_status as u 
  inner join folders as f on u.user_status_id = f.user_status_id 
  where u.user_id = ?`;
  getData(stmt, req, res, -1);
});

router.get("/folders/:id", async (req, res) => {
  const id = req.params.id;

  let stmt = `select fl.*,f.folder_name from user_status as u 
  inner join folders as f on u.user_status_id = f.user_status_id 
  inner join files as fl on f.folder_id = fl.folder_id 
  where u.user_id = ? and f.folder_id = ?`;

  getData(stmt, req, res, id);
});

router.put("/update/:id", async (req, res) => {
  const data = {
    id: req.params.id,
    ...req.body,
  };

  const result = await validate(req, res, data);

  if (!result.valid) {
    return res.status(result.status).json(result);
  }

  console.log(result.valid);

  updateData(req, res, data);
});

router.post("/create", createFolder);

router.delete("/delete/:id", async (req, res) => {
  const data = { id: req.params.id, ...req.body };

  const result = await validate(req, res, data);

  if (!result.valid) {
    return res.status(result.status).json(result);
  }

  deleteData(req, res, data);
});

router.get("/something", async (req, res) => {
  let j = 1;
  let g = 0;
  for (let i = 1; i <= 20; i++) {
    await db.promise().query(
      `update files 
set file_path = "/folder${j}/file${i}.txt", file_name = "file${i}"
where files_id = ?`,
      [i]
    );
    if (g < 2) {
      g++;
    } else {
      j++;
      g = 0;
    }
  }
});

export default router;
