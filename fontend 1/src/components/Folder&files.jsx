import FolderIcon from "../assets/FolderIcon.png";
import FileIcon from "../assets/FileIcon.png";
import { useState } from "react";

export default function Folders({
  edit,
  setEdit,
  info,
  infoSecond,
  infoThird,
  fetchFolder,
  setFileParentName,
}) {
  let [toggle, setToggle] = useState(false);

  async function deleteData() {
    const url = `http://localhost:5000/home/delete/${
      infoSecond === "folder" ? infoThird.folder_id : infoThird.files_id
    }`;

    try {
      console.log("asdasd: ", infoThird);
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          type: infoSecond,
          name: info.name,
          folder_name: infoThird.folder_name,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        console.log("error");
        return;
      }

      const data = await res.json();
      console.log(data);

      fetchFolder();
    } catch (e) {
      console.log(e);
    }
  }

  async function IfFolder() {
    if (infoSecond === "folder") {
      fetchFolder("file", infoThird.folder_id);
      setFileParentName(info.name);
      return;
    }

    if (infoSecond === "file") {
      console.log("success open file");
    }

    return;
  }

  return (
    <div className="flex flex-col items-center border-[2px] border-black w-[110px] h-[100px] relative rounded-sm">
      <div
        className="p-[4px] text-[7px] absolute top-0 right-1 z-30 cursor-pointer focus:outline-none focus:ring-0 hover:bg-transparent hover:text-current"
        onClick={() => setToggle(!toggle)}
      >
        🔴
        <br />
        🟡
        <br />
        🟢
      </div>
      <img
        src={infoSecond === "file" ? FileIcon : FolderIcon}
        alt={info.name}
        className="w-[70px] h-[55px] mt-[17px] mb-[5px]"
        onClick={IfFolder}
      />
      <h2
        className="font-bold w-full h-full p-[2px] border-t-[1px] border-black text-center text-[13px] "
        onClick={IfFolder}
      >
        {info.name}
      </h2>

      {toggle ? (
        <div className="flex flex-col text-[13px] font-bold absolute z-20 w-full h-full bg-white justify-between rounded-sm">
          <span className="p-[6px] w-full border-b-[1px] border-black hover:bg-slate-200 cursor-pointer">
            📒 Details
          </span>
          <span
            className="p-[6px] w-full border-b-[1px] border-black hover:bg-slate-200 cursor-pointer"
            onClick={() =>
              setEdit(
                infoSecond === "folder"
                  ? {
                      id: infoThird.folder_id,
                      clicked: true,
                      type: infoSecond,
                      name: info.name,
                    }
                  : {
                      id: infoThird.files_id,
                      clicked: true,
                      type: infoSecond,
                      name: info.name,
                    }
              )
            }
          >
            🔨 Rename
          </span>
          <span
            className="p-[6px] w-full hover:bg-slate-200 cursor-pointer"
            onClick={deleteData}
          >
            ❌ Delete
          </span>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
