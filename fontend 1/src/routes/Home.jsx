import { useState, useEffect } from "react";
import { Navbar_menu } from "../components/Navbar-menu";
import FolderIcon from "../assets/FolderIcon.png";
import FileIcon from "../assets/FileIcon.png";

export function Home() {
  let [edit, setEdit] = useState({id: -1, clicked: false, type: "nono", name: ""});
  let [loading, setLoading] = useState(true);
  let [err, setErr] = useState(true);
  const [email, setEmail] = useState();
  const [info, setInfo] = useState();
  const [file, setFile] = useState(null);
  

  useEffect(() => {
    fetchFolder("folder", 2);
  }, []);

  async function fetchFolder(type, id) {
    let url = "http://localhost:5000/home/folders";

    if (type === "file") {
      url = `http://localhost:5000/home/folders/${id}`;
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        console.log("error");
        return;
      }

      const data = await res.json();
      setEmail(data.email);
      setInfo(data);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }
  async function editUser(e) {
     e.preventDefault();
    console.log(edit)
    const url = `http://localhost:5000/home/update/${edit.id}`;
 
     try {

       const res = await fetch(url, {
         method: "PUT",
         headers: {
          "Content-type": "application/json"
         },
         body: JSON.stringify({
          name: e.target.new_name.value,
          type: edit.type
         }),
         credentials: "include"
       });
 
       if (!res.ok) {
         setLoading(false);
         console.log("error");
         return;
       }
 
       const data = await res.json();
       console.log(data);

       fetchFolder();

       setLoading(false);
     } catch (e) {
       setLoading(false);
       console.log(e);
     }
     
  }
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  async function fileSubmit(e) {
     e.preventDefault();

     const url = `http://localhost:5000/home/update/${edit.id}`;
     
     try {

       const res = await fetch(url, {
         method: "PUT",
         headers: {
          "Content-type": "application/json"
         },
         body: JSON.stringify({
          name: "folder",
          type: edit.type
         }),
         credentials: "include"
       });
 
       if (!res.ok) {
         setLoading(false);
         console.log("error");
         return;
       }
 
       const data = await res.json();
       console.log(data);

       fetchFolder();

       setLoading(false);
     } catch (e) {
       setLoading(false);
       console.log(e);
     }
     
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
      {err ? <Error message={{error: "Invalid"}}/> : <div/>}

      <div className=" w-[1370px]  mt-[90px] ml-auto p-[10px] pt-[4px] pr-[350px]">
        <div className="flex items-center h-[40px] mb-[40px]">
          {edit ? (
            <form action="" className="w-full flex items-center" onSubmit={editUser} >
              <input
                type="text"
                placeholder="New name"
                name="new_name"
                className="flex-1 border-2 border-gray-300 rounded-lg p-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={edit.name}
                onChange={(e) => setEdit({id: edit.id, clicked: edit.clicked, type: edit.type, name: e.target.value})}
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
           
      <form action="" className="flex items-center ml-auto" onSubmit={fileSubmit}>
      <input
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
        <button className="px-2 py-1 ml-auto bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            ➕
          </button>
          <button className="px-2 py-1 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2" onClick={()=>fetchFolder("Folder", -1)}>
            ⬅️
          </button>
      </form>
        </div>
        <div className="flex flex-wrap content-start w-full h-[520px] overflow-y-auto gap-[20px]">
          <div className="flex flex-wrap content-start w-full h-[520px] overflow-y-auto gap-[20px]">
            <div className="flex flex-wrap content-start w-full h-[520px] overflow-y-auto gap-[20px]">
              {info.data[0].map((e, i) => (
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

                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Folders({ edit, setEdit, info, infoSecond,infoThird,fetchFolder}) {
  let [toggle, setToggle] = useState(false);
  async function deleteData() {

    const url = `http://localhost:5000/home/delete/${infoSecond === "folder" ? infoThird.folder_id: infoThird.files_id}`;
 
    try {
    console.log(infoSecond);
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
         "Content-type": "application/json"
        },
        body: JSON.stringify({
         type: infoSecond
        }),
        credentials: "include"
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

  async function IfFolder(){
     
     if(infoSecond === "folder"){
      fetchFolder("file",infoThird.folder_id);
      return;
     }

     if(infoSecond === "file"){
      console.log("success open file");
     }

     return;
  }
  
  return (
    <div className="flex flex-col items-center border-[2px] border-black w-[110px] h-[100px] relative rounded-sm" >
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
      <h2 className="font-bold w-full h-full p-[2px] border-t-[1px] border-black text-center text-[13px] " onClick={IfFolder}>
        {info.name}
      </h2>

      {toggle ? (
        <div className="flex flex-col text-[13px] font-bold absolute z-20 w-full h-full bg-white justify-between rounded-sm">
          <span className="p-[6px] w-full border-b-[1px] border-black hover:bg-slate-200 cursor-pointer">
            📒 Details
          </span>
          <span
            className="p-[6px] w-full border-b-[1px] border-black hover:bg-slate-200 cursor-pointer"
            onClick={()=>setEdit((infoSecond === "folder" ? {id: infoThird.folder_id, clicked: true, type: infoSecond, name: info.name} : {id: infoThird.files_id, clicked: true,type: infoSecond, name: info.name}))}
          >
            🔨 Rename
          </span>
          <span className="p-[6px] w-full hover:bg-slate-200 cursor-pointer" onClick={deleteData}>
            ❌ Delete
          </span>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

function Error({message}) {
  return (
    <div className="p-[5px] absolute top-[20px] left-1/4 transform -translate-x-1/4 w-[700px] h-[40px] text-[14px] rounded-[10px] mt-[20px] border border-red-500">
      <h2 className="flex items-start justify-center h-[100%] text-[16px] text-[red]">{message.error}</h2>
    </div>
  );
}