import { mkdir, rmdir, rm, rename, unlink } from "fs";
import path from "path";
import db from "../Routes/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { validate } from "./Validate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function deleteData(req, res, data) {
  if (!(data.type === "folder" || data.type === "file")) {
    return res.status(401).json({ Type: "The data type is not valid" });
  }
  console.log("dasd", data.folder_name);
  const stmt =
    data.type === "folder"
      ? `delete from folders where folder_id = ?`
      : `delete from files where files_id = ?`;

  let pathData;

  if (data.type === "folder") {
    pathData = path.join(
      __dirname.substring(0, __dirname.length - 9),
      "/User_files"
    );
    let folderPath = path.join(pathData, data.name);
    deleteFolder(folderPath, stmt, data, res);
  } else {
    pathData = path.join(
      __dirname.substring(0, __dirname.length - 9),
      `User_files`,
      data.folder_name
    );
    let filePath = path.join(pathData, data.name);
    deleteFile(filePath, stmt, data, res);
  }
}

function deleteFolder(patha, stmt, data, res) {
  rm(patha, { recursive: true, force: true }, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Server not respoding" });
    } else {
      try {
        await db.promise().query(stmt, data.id);

        return res.status(201).json({ success: "Succesfully deleted" });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Server not responding" });
      }
    }
  });
}

function deleteFile(filePath, stmt, data, res) {
  unlink(filePath, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Server not respoding" });
    } else {
      try {
        await db.promise().query(stmt, data.id);

        return res.status(201).json({ success: "Succesfully deleted" });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Server not responding" });
      }
    }
  });
}
