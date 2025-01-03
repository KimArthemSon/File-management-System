import { useState } from "react";
import profileicon from "../assets/profileicon.png";
export default function User_info() {
  let [toggle, setToggle] = useState(true);
  


  return (
    <div className="flex flex-row justify-center items-center p-6 bg-gray-100 h-screen">
      <div className="mb-auto mr-10 mt-10">
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
        {toggle ? <Personal /> : <Company />}
      </div>
    </div>
  );
}

function Personal() {
  const [email, setEmail] = useState("paulvan@gmail.com");
  const [firstName, setFirstName] = useState("Paul");
  const [lastName, setLastName] = useState("Son");
  const [age, setAge] = useState(20);
  const [birthday, setBirthday] = useState("2001-05-31");
  const [contact, setContact] = useState("09617498347");

  return (
    <form action="" className="flex flex-col">
      <h1 className="text-xl font-bold mb-4">Personal Info</h1>

      <div className="flex flex-col">
        <label htmlFor="personal-email" className="font-medium mb-1">
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="first_name" className="font-medium mb-1">
          First Name:
        </label>
        <input
          type="text"
          name="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="last_name" className="font-medium mb-1">
          Last Name:
        </label>
        <input
          type="text"
          name="last_name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="age" className="font-medium mb-1">
          Age:
        </label>
        <input
          type="number"
          name="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="birthday" className="font-medium mb-1">
          Birthday:
        </label>
        <input
          type="date"
          value={birthday}
          name="birthday"
          onChange={(e) => setBirthday(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="contact" className="font-medium mb-1">
          Contact:
        </label>
        <input
          type="text"
          name="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>
      <button className="px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white">
        Update
      </button>
    </form>
  );
}

function Company() {
  const [companyEmail, setCompanyEmail] = useState("twitter@gmail.com");
  const [companyName, setCompanyName] = useState("Paul");
  const [companyContact, setCompanyContact] = useState("09617498347");

  return (
    <form action="" className="flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-4">Company Info</h1>

      <div className="flex flex-col">
        <label htmlFor="company-email" className="font-medium mb-1">
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="company-name" className="font-medium mb-1">
          Name:
        </label>
        <input
          type="text"
          name="name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="company-contact" className="font-medium mb-1">
          Contact:
        </label>
        <input
          type="text"
          name="contact"
          value={companyContact}
          onChange={(e) => setCompanyContact(e.target.value)}
          className="input-field border-b-2 border-gray-400 pb-2 mb-4"
        />
      </div>
      <button className="px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white">
        Update
      </button>
    </form>
  );
}
