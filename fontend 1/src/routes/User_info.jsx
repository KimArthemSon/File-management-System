import { useEffect, useState } from "react";
import profileicon from "../assets/profileicon.png";
import { useNavigate } from "react-router-dom";
import Personal from "../components/Personal";
import Company from "../components/Company";

export default function User_info() {
  let [toggle, setToggle] = useState(true);
  let navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    console.log("hello");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/user_info/",{
          method: "GET",
          credentials: "include"
        });

        if (!res.ok) {
          console.error("Failed to fetch data");
          return;
        }

        const data = await res.json();
        console.log(data);

        setToggle(data.user_type === "personal");
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-row justify-center items-center p-6 bg-gray-100 h-screen">
      <div className="flex flex-col items-center mb-auto mr-10 mt-10">
        <img
          src={profileicon}
          className="w-24 h-24 rounded-full shadow-lg"
          alt="profile"
        />
        <button
          onClick={() => navigate("/home")}
          className="mt-[10px] px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white"
        >
          Home
        </button>
      </div>

      <div
        className={`w-full max-w-md bg-white p-6 rounded-lg shadow-lg ${
          !toggle ? "mb-[170px]" : ""
        }`}
      >
        {toggle ? <Personal submit={submit} /> : <Company submit={submit} />}
      </div>
    </div>
  );
}
