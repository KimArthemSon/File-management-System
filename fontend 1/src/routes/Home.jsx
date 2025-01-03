import { useNavigate } from "react-router-dom";
import profileicon from "../assets/profileicon.png";
import { useState } from "react";
export function Home() {
  
  let navigate = useNavigate();
  let [toggle, setToggle] = useState(true);
  return (
    <div>
      <div className="flex gap-[10px] items-center absolute right-[70px] top-[30px]">
        <div className="border-[2px] border-black font-bold p-[10px] hover:bg-slate-600 hover:text-[white]">paulvan@gmail.com</div>
        <img onClick={()=>setToggle(!toggle)}
          src={profileicon}
          className="w-[60px] h-[60px] rounded-full shadow-lg cursor-pointer"
          alt="profile"
        />
      </div>
      {toggle? 
      <div className="flex flex-col items-center absolute right-[60px] mt-[65px] top-[37px] border-[1px] border-black ">
        <button  onClick={()=>navigate("/userInfo")} className="border-[1px] border-black w-full p-[10px] font-bold hover:bg-slate-600 hover:text-[white]">Profile</button>
        <button  onClick={()=>navigate("/")} className="border-[1px] border-black w-full p-[10px] font-bold hover:bg-slate-600 hover:text-[white]">Logout</button>
      </div> : <div></div>
      }
  </div>
  );
}

function Folders(folder_name) {
  return (
    <div>
      <img src="" alt={folder_name} />
      <div>[[i]]</div>
      <div>
        <div>Name: </div>
        <div>Date: </div>
        <div>Size: </div>
        <div>delete</div>
        <div>Rename</div>
        <div>Download</div>
      </div>
    </div>
  );
}
