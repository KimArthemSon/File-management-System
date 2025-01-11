import db from "../Routes/database.js";

export async function getData(stmt, req, res, id) {
  try {
    let queryData = await db
      .promise()
      .query(stmt, [req.session.user_id, Number(id)]);

    if (!queryData[0][0] && id === -1) {
      return res.status(404).json({
        error: "No Folders have found",
        type: "folder",
        haveData: true,
        email: req.session.email,
        data: [{}],
      });
    } else if (!queryData[0][0]) {
      return res.status(404).json({
        error: "No files have found",
        type: "folder",
        haveData: true,
        email: req.session.email,
        data: [{}],
      });
    }

    queryData = queryData.slice(0, queryData.length - 1);

    const finalData = {
      email: req.session.email,
      data: queryData,
      haveData: false,
      type: id === -1 ? "folder" : "file",
    };

    return res.status(201).json(finalData);
  } catch (e) {
    return res.status(500).json({ error: "Server is not responding" });
  }
}
