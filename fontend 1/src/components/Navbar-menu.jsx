import { useNavigate } from "react-router-dom";
import { useState } from "react";
import profileicon from "../assets/profileicon.png";

export function Navbar_menu({ email }) {
  let navigate = useNavigate();
  let [toggle, setToggle] = useState(true);

  async function Logout() {
    try {
      const res = await fetch("http://localhost:5000/login/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (e) {
      console.log("Logout succesfuly");
    }
    navigate("/");
  }

  return (
    <>
      <div className="flex gap-[10px] items-center absolute right-[70px] top-[30px]">
        <div className="border-[2px] border-black font-bold p-[10px] hover:bg-slate-600 hover:text-[white]">
          {email}
        </div>
        <img
          onClick={() => setToggle(!toggle)}
          src={profileicon}
          className="w-[60px] h-[60px] rounded-full shadow-lg cursor-pointer"
          alt="profile"
        />
      </div>
      {toggle ? (
        <div className="flex flex-col items-center absolute right-[60px] mt-[65px] top-[37px] border-[1px] border-black ">
          <button
            onClick={() => navigate("/home")}
            className="border-[1px] border-black w-full p-[10px] font-bold hover:bg-slate-600 hover:text-[white]"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/userInfo")}
            className="border-[1px] border-black w-full p-[10px] font-bold hover:bg-slate-600 hover:text-[white]"
          >
            Profile
          </button>
          <button
            onClick={Logout}
            className="border-[1px] border-black w-full p-[10px] font-bold hover:bg-slate-600 hover:text-[white]"
          >
            Logout
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
