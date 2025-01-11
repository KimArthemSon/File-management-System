import db from "../Routes/database.js";

export async function validate(req, res, data) {
  if (!data.type) {
    return { error: "Not valid json", valid: false, status: 400 };
  }

  const stmt = data.type === "folder" ? `f.folder_id` : `fl.files_id`;

  try {
    const result = await db.promise().query(
      `select * from user_status as u
          inner join folders as f on u.user_status_id = f.user_status_id
          ${data.type === "file" ? `inner join files as fl on f.folder_id = fl.folder_id` : ``} 
          where u.user_id = ? and ${stmt} = ?`,
      [req.session.user_id, Number(data.id)]
    );

    console.log(result);
    if (!result[0][0]) {
      return { error: "Not data found", valid: false, status: 404 };
    }

    return { valid: true };
  } catch (e) {
    console.log(e);
    return { error: "Server not responding", valid: false, status: 500 };
  }
}
