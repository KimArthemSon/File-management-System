import express from "express";
import db from "./database.js";
const router = express.Router();

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

  if(!result.valid){
    return res.status(result.status).json(result);
  }

  console.log(result.length);

  updateData(req, res, data);
});

router.post("/create", async (req, res) => {
  const data = { ...req.body };

  if (!data.name || !data.size) {
    return res.status(400).json({ error: "Each field should not be empty" });
  }

  const result = await validate(req, res, data);

  if(result.valid){
    return res.status(result.status).json(result);
  }

  let stmt = `insert into folders(user_status_id, folder_name, date_created, folder_path, folder_sizeGB)
  select user_status_id,?,now(),concat('/', ?),? from user_status where user_id = ?`;

  try {
    await db.promise().query(stmt, [data.name, data.name, data.size, req.session.user_id]);
    return res.status(200).json({ success: "Successfuly created" });
  } catch (e) {
    return res.status(500).json({ error: "Server not responding" });
  }
});

router.post("/create/:id", async (req, res) => {
  const data = { id: req.params.id, ...req.body };

  if (!data.file_name || !data.fileType || !data.size || !data.folder_name) {
    return res.status(400).json({ error: "Each field should not be empty" });
  }
  const result = await validate(req, res, data);

  if(result.valid){
    return res.status(result.status).json(result);
  }

  let stmt = `insert into files(folder_id, file_name, date_created, file_path, file_size_GB)
  values(?,?,now(),concat('/', ?,'/',?,'.',?),?)`;

  try {
    await db.promise().query(stmt, [data.id,data.file_name,data.folder_name, data.file_name, data.fileType,data.size]);

    return res.status(200).json({ success: "Successfuly created" });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server not responding" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const data = { id: req.params.id, ...req.body };
  
  const result = await validate(req, res, data);
  
  if(!result.valid){
    return res.status(result.status).json(result);
  }
  console.log(result.valid);
  deleteData(req, res, data);

});

async function getData(stmt, req, res, id) {
  
  try {
    
    let queryData = await db.promise().query(stmt, [req.session.user_id, Number(id)]);
        console.log(req.session.user_id, id)
   
    
    if (!queryData[0][0] && id === -1) {
      return res
        .status(404)
        .json({NoData: "No Folders have found" });
    } else if (!queryData[0][0]) {
      return res.status(404).json({ NoData: "No files have found",param: id });
    }

    queryData = queryData.slice(0, queryData.length - 1);
    
    const finalData = { email: req.session.email, data: queryData,type: (id ===- 1 ? "folder": "file") };

    return res.status(201).json(finalData);
  } catch (e) {
    return res.status(500).json({ error: "Server is not responding" });
  }
}

async function updateData(req, res, data) {
  let stmt;
  let values;

  if (data.type === "folder") {
    stmt = `UPDATE folders AS f
         JOIN files AS fl ON f.folder_id = fl.folder_id
         SET 
         f.folder_name = ?,
         f.folder_path = CONCAT('/', ?),
         fl.file_path = CONCAT('/', ?,'/' ,SUBSTRING(file_path, LOCATE('/', file_path, 2) + 1))
         WHERE f.folder_id = ?`;

    values = [data.name, data.name, data.name, data.id];

  } else if (data.type === "file") {
    stmt = `UPDATE files
         SET 
         file_name = ?, 
         file_path = CONCAT(SUBSTRING_INDEX(file_path, '/', 2), '/', ?, '.txt')
         WHERE files_id = ?`;

    values = [data.name, data.name,data.id];

  } else {
    return res.status(401).json({ Type: "The data type is not valid" });
  }
  try {
    await db.promise().query(stmt, values);

    return res.status(201).json({ success: "Succesfuly updated" });
  } catch (e) {
    return res.status(500).json({ error: "Server not responding" });
  }
}

async function deleteData(req, res, data) {

  if (!(data.type === "folder" || data.type === "file")) {
    return res.status(401).json({ Type: "The data type is not valid" });
  }
   console.log(data);
  const stmt =
    data.type === "folder"
      ? `delete from folders where folder_id = ?`
      : `delete from files where files_id = ?`;

  try {
    await db.promise().query(stmt, data.id);

    return res.status(201).json({ success: "Succesfuly deleted" });
  } catch (e) {
    return res.status(500).json({ error: "Server not responding" });
  }
}

async function validate(req, res, data) {

  if (!data.type) {
    return { error: "Not valid json", valid: false, status: 400};
  }

  const stmt = data.type === "folder" ? `f.folder_id` : `fl.files_id`;
   console.log("id: ",req.session.user_id, data.type, data.id);
  try {

    const result = await db.promise().query(
      `select * from user_status as u
        inner join folders as f on u.user_status_id = f.user_status_id
        ${data.type === "file" ? `inner join files as fl on f.folder_id = fl.folder_id` : ``} 
        where u.user_id = ? and ${stmt} = ?`,
      [req.session.user_id, Number(data.id)]
    );
    
    console.log(result)
   if(!result[0][0]){
    return { error: "Not data found", valid: false, status: 404}
   }
    
    return {valid : true};

  } catch (e) {
    console.log(e);
    return { error: "Server not responding",valid: false, status: 500 };

  }
}


router.get('/something', async (req, res)=>{
  let j = 1;
  let g =0;
   for(let i=1;i<=20;i++){
      await db.promise().query(`update files 
set file_path = "/folder${j}/file${i}.txt", file_name = "file${i}"
where files_id = ?`, [i]);
  if(g<2){
    g++;
  }else{
    j++;
    g=0;
  }
  
   }
})
export default router;
