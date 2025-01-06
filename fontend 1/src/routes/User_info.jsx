import { useEffect, useState } from "react";
import profileicon from "../assets/profileicon.png";
import { useNavigate } from "react-router-dom";
import Personal from "../components/Personal";
import Company from "../components/Company";

import { Navbar_menu } from "../components/Navbar-menu";

export default function User_info() {
  let [toggle, setToggle] = useState(true);
  let [info, setInfo] = useState({});
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);
  let navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    let data = {};
    if (info.user_type === "personal") {
      data = {
        email: e.target.email.value,
        first_name:e.target.first_name.value,
        last_name:e.target.last_name.value,
        age:e.target.age.value,
        birthday:e.target.birthday.value,
        contacts:e.target.contacts.value,
      };
    
    } else {
      data = {
        email:e.target.email.value,
        company_name:e.target.company_name.value,
        contacts:e.target.contacts.value,
      };
    }

  console.log(data);
    try {
      const res = await fetch("http://localhost:5000/user_info/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
   
      if (!res.ok) {
        setError("Failed to fetch data.");
        setLoading(false);
        return;
      }

    console.log((await res.json()).success);

      fetchData();
    } catch (e) {
      setError("Error fetching data.");
      setLoading(false);
    }
    return;
  }

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/user_info/", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setError("Failed to fetch data.");
        setLoading(false);
        return;
      }

      let data = await res.json();
      if (data.user_type === "personal") {
        data.birthday = (data.birthday + "").substring(0, 10);
      }

      console.log(data);
      setInfo(data);
      setToggle(data.user_type === "personal");
      setLoading(false);
    } catch (e) {
      setError("Error fetching data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-row justify-center items-center p-6 bg-gray-100 h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-row justify-center items-center p-6 bg-gray-100 h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center items-center p-6 bg-gray-100 h-screen">
      {<Navbar_menu email={info.email}/>}
      <div className="flex flex-col items-center mb-auto mr-10 mt-10">
        <img
          src={profileicon}
          className="w-24 h-24 rounded-full shadow-lg"
          alt="profile"
        />
        
      </div>

      <div
        className={`w-full max-w-md bg-white p-6 rounded-lg shadow-lg ${
          !toggle ? "mb-[170px]" : ""
        }`}
      >
        {toggle ? (
          <Personal submit={submit} data={info} />
        ) : (
          <Company submit={submit} data={info} />
        )}
      </div>
    </div>
  );
}
