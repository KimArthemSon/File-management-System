import { mkdir, rmdir, rm, rename } from "fs";
import path from "path";
import db from "../Routes/database.js";
import { validate } from "./Validate.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const folderName = (await getFolderName(req.params.id)) || "error";
    console.log("foldername: ", folderName);

    const pathDis = path.join(
      __dirname.substring(0, __dirname.length - 9),
      "User_files",
      folderName
    );
    console.log("foldername: ", pathDis);
    cb(null, pathDis);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

export async function createFile(req, res) {
  const data = {
    id: req.params.id,
    folder_name: req.body.name,
    type: "file",
    ...req.file,
  };

  const uploadedFile = req.file;

  try {
    if (!uploadedFile) {
      return res.status(400).send("No file uploaded.");
    }
    const result = await validate(req, res, data);

    if (result.valid) {
      return res.status(result.status).json(result);
    }

    let stmt = `insert into files(folder_id, file_name, date_created, file_path, file_size_GB)
      values(?,?,now(),concat('/', ?,'/',?),?)`;

    await db
      .promise()
      .query(stmt, [
        data.id,
        data.originalname,
        data.folder_name,
        data.originalname,
        data.size / 1048576,
      ]);

    return res.status(200).json({ success: "Successfuly created" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server not responding" });
  }
}

export async function createFolder(req, res) {
  const data = { size: 1.0, type: "folder", ...req.body };

  if (!data.name) {
    return res.status(400).json({ error: "Name should not be empty" });
  }

  let stmt = `insert into folders(user_status_id, folder_name, date_created, folder_path, folder_sizeGB)
      select user_status_id,?,now(),concat('/', ?),? from user_status where user_id = ?`;

  const pathUserFiles = path.join(
    __dirname.substring(0, __dirname.length - 9),
    "/User_files"
  );

  const folderPath = path.join(pathUserFiles, data.name);

  mkdir(folderPath, { recursive: true }, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Fialed to create new folder" });
    } else {
      try {
        await db
          .promise()
          .query(stmt, [data.name, data.name, data.size, req.session.user_id]);

        return res.status(200).json({ success: "Successfuly created" });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Server not responding" });
      }
    }
  });
}

async function getFolderName(id) {
  const result = await db
    .promise()
    .query(`select*from folders where folder_id = ?`, [id]);
  return result[0][0].folder_name;
}
