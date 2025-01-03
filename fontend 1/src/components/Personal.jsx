import { useState } from "react";
export default function Personal({submit}) {
    const [email, setEmail] = useState("paulvan@gmail.com");
    const [firstName, setFirstName] = useState("Paul");
    const [lastName, setLastName] = useState("Son");
    const [age, setAge] = useState(20);
    const [birthday, setBirthday] = useState("2001-05-31");
    const [contact, setContact] = useState("09617498347");
    
    return (
      <form action="" onSubmit={submit} className="flex flex-col">
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