import { useState } from "react";

export default function Company({submit}) {
    const [companyEmail, setCompanyEmail] = useState("twitter@gmail.com");
    const [companyName, setCompanyName] = useState("Paul");
    const [companyContact, setCompanyContact] = useState("09617498347");
  
    return (
      <form action="" onSubmit={submit} className="flex flex-col gap-4">
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
  