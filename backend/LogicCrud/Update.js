import { mkdir, rmdir, rm, rename } from "fs";
import path from "path";
import db from "../Routes/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function updateData(req, res, data) {
  let stmt;
  let values;

  if (data.type === "folder") {
    const HaveInsideFiles = await db
      .promise()
      .query(`select * from files where folder_id = ${data.id}`);

    console.log("dhasdasd:    ", HaveInsideFiles);
    if (!HaveInsideFiles[0][0]) {
      stmt = `UPDATE folders AS f
        SET 
        f.folder_name = ?,
        f.folder_path = CONCAT('/', ?)
        WHERE f.folder_id = ?`;
      values = [data.name, data.name, data.id];
    } else {
      stmt = `UPDATE folders AS f
          JOIN files AS fl ON f.folder_id = fl.folder_id
           SET 
           f.folder_name = ?,
           f.folder_path = CONCAT('/', ?),
           fl.file_path = CONCAT('/', ?,'/' ,SUBSTRING(file_path, LOCATE('/', file_path, 2) + 1))
           WHERE f.folder_id = ?`;
      values = [data.name, data.name, data.name, data.id];
    }

    folderRename(req, res, data, stmt, values);
  } else if (data.type === "file") {
    stmt = `UPDATE files
           SET 
           file_name = ?, 
           file_path = CONCAT(SUBSTRING_INDEX(file_path, '/', 2), '/', ?, '.txt')
           WHERE files_id = ?`;

    values = [data.name, data.name, data.id];
  } else {
    return res.status(401).json({ Type: "The data type is not valid" });
  }
}

async function folderRename(req, res, data, stmt, values) {
  const pathData = path.join(
    __dirname.substring(0, __dirname.length - 9),
    "/User_files"
  );
  const newName = path.join(pathData, data.name);
  const getOldName = await db
    .promise()
    .query(`select * from folders where folder_id = ?`, [data.id]);

  const oldName = path.join(pathData, getOldName[0][0].folder_name);
  console.log(values, "new name: ", data);
  rename(oldName, newName, async (err) => {
    try {
      if (err) {
        return res.status(500).json({ error: "failed to update folder" });
      } else {
        await db.promise().query(stmt, values);
        return res.status(201).json({ success: "Succesfuly updated" });
      }
    } catch (e) {
      return res.status(500).json({ error: "Server not responding" });
    }
  });
}
