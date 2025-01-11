import { useState, useEffect } from "react";
import { Navbar_menu } from "../components/Navbar-menu";
import Folders from "../components/Folder&files.jsx";

export function Home() {
  let [edit, setEdit] = useState({
    id: -1,
    clicked: false,
    type: "nono",
    name: "",
  });
  let [loading, setLoading] = useState(true);
  let [haveData, setHaveData] = useState(true);
  let [err, setErr] = useState(false);
  let [errMessage, setErrMessage] = useState("");
  const [email, setEmail] = useState();
  const [info, setInfo] = useState(null);
  let [fileParentID, setfileParentID] = useState(null);
  let [fileParentName, setFileParentName] = useState(null);
  const [newFolder, setNewFolder] = useState(false);
  const [wasFolder, setWasFolder] = useState(null);

  useEffect(() => {
    fetchFolder("folder", 2);
  }, []);

  async function fetchFolder(type, id) {
    setLoading(true);
    setHaveData(true);
    setfileParentID(id);
    let url = "http://localhost:5000/home/folders";

    if (type === "file") {
      url = `http://localhost:5000/home/folders/${id}`;
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      console.log(data);
      setHaveData(false);
      setEmail(data.email);
      setInfo(data);
      console.log(type);
      setWasFolder(type === "folder" ? true : false);
      setLoading(false);
    } catch (e) {
      setHaveData(true);
      timeOutErr(e);
      console.log(e);
    }
  }

  async function editUser(e) {
    e.preventDefault();

    const url = `http://localhost:5000/home/update/${edit.id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: e.target.new_name.value,
          type: edit.type,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        console.log("error");
        return;
      }
      setEdit({
        id: edit.id,
        clicked: false,
        type: edit.type,
        name: edit.name,
      });

      const data = await res.json();

      fetchFolder();

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  async function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!event.target.files[0]) {
      return;
    }
    console.log("hello: ", fileParentName);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", fileParentName);

    try {
      const res = await fetch(
        `http://localhost:5000/home/create/${fileParentID}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.log(res);
        return;
      }
      fetchFolder("file", fileParentID);
    } catch (e) {
      console.log(e);
    }

    console.log(selectedFile);
  }

  function handleFileUpload() {
    if (wasFolder) {
      setNewFolder(true);
      return;
    } else {
      const fileInput = document.getElementById("file-input");
      fileInput.click();

      return;
    }
  }

  async function HandleFolder(e) {
    e.preventDefault();

    const name = e.target.folderName.value;
    try {
      const res = await fetch("http://localhost:5000/home/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        timeOutErr(data.error);
        return;
      }

      fetchFolder();
    } catch (e) {
      timeOutErr(e);
    }
  }

  function timeOutErr(e) {
    setLoading(false);
    console.log(e);
    setErr(true);
    setErrMessage(e);
    setTimeout(() => {
      setErr(false);
      setErrMessage("");
    }, 500);
  }
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {<Navbar_menu email={email} />}
      {err ? <Error message={errMessage} /> : <div />}
      {newFolder ? (
        <NewFolder HandleFolder={HandleFolder} setNewFolder={setNewFolder} />
      ) : (
        <div />
      )}

      <div className=" w-[1370px]  mt-[90px] ml-auto p-[10px] pt-[4px] pr-[350px]">
        <div className="flex items-center h-[40px] mb-[40px]">
          {edit ? (
            <form
              action=""
              className="w-full flex items-center"
              onSubmit={editUser}
            >
              <input
                type="text"
                placeholder="New name"
                name="new_name"
                className="flex-1 border-2 border-gray-300 rounded-lg p-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={edit.name}
                onChange={(e) =>
                  setEdit({
                    id: edit.id,
                    clicked: edit.clicked,
                    type: edit.type,
                    name: e.target.value,
                  })
                }
              />
              <button
                type="submit"
                className="px-2 py-1 mr-[10px] bg-green-500 text-white rounded-[50px] hover:bg-green-600"
              >
                ✅
              </button>
              <button
                type="reset"
                className="px-2 py-1 mr-[40px] bg-red-800 text-white rounded-[50px] hover:bg-red-600"
                onClick={() => setEdit(edit == false)}
              >
                ❌
              </button>
            </form>
          ) : (
            <div />
          )}
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            id="file-input"
          />
          <button
            className="px-2 py-1 ml-auto bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleFileUpload}
          >
            ➕
          </button>
          <button
            className="px-2 py-1 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
            onClick={() => fetchFolder("folder", -1)}
          >
            ⬅️
          </button>
        </div>
        <div className="flex flex-wrap content-start w-full h-[520px] overflow-y-auto gap-[20px]">
          <div className="flex flex-wrap content-start w-full h-[520px] overflow-y-auto gap-[20px]">
            <div className="flex flex-wrap content-start w-full h-[520px] overflow-y-auto gap-[20px]">
              {info.haveData ? (
                <div />
              ) : (
                info.data[0].map((e, i) => (
                  <Folders
                    key={i}
                    edit={edit}
                    setEdit={setEdit}
                    info={{
                      name: info.type === "file" ? e.file_name : e.folder_name,
                    }}
                    infoSecond={info.type}
                    infoThird={e}
                    fetchFolder={fetchFolder}
                    setFileParentName={setFileParentName}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Error({ message }) {
  return (
    <div className="p-[5px] absolute top-[20px] left-1/4 transform -translate-x-1/4 w-[700px] h-[40px] text-[14px] rounded-[10px] mt-[20px] border border-red-500">
      <h2 className="flex items-start justify-center h-[100%] text-[16px] text-[red]">
        {message}
      </h2>
    </div>
  );
}

function NewFolder({ HandleFolder, setNewFolder }) {
  return (
    <div className="absolute w-[500px] h-[100px] border-[1px] border-black bg-white rounded-[20px] p-[10px]">
      <form action="" onSubmit={HandleFolder}>
        <h1 className="mb-[10px] text-[20px] font-bold">Folder Name</h1>
        <input
          type="text"
          name="folderName"
          className="border-[2px] border-black rounded-[5px] w-[400px] pl-[10px] p-[2px]"
        />
        <button
          className="border-[2px] border-black ml-[10px] rounded-[5px] p-[2px]"
          type="submit"
        >
          {" "}
          ✅
        </button>
        <button
          className="border-[2px] border-black ml-[10px] rounded-[5px] p-[2px]"
          onClick={() => setNewFolder(false)}
        >
          ❌
        </button>
      </form>
    </div>
  );
}
