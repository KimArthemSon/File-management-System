import { useState } from "react";
export function Register({ togle }) {
  let [userType, setUserType] = useState(true);
  let [response, setResponse] = useState();
  let [message, setMessage] = useState();
  const err =
    "flex items-center justify-center text-[16px] text-[red] font-bold w-full h-[40px] rounded-[10px] border-[1px] border-[red]";
  const suc =
    "flex items-center justify-center text-[16px] text-[green] font-bold w-full h-[40px] rounded-[10px] border-[1px] border-[rgb(0,220,0)]";
  
    function toggle_userType(e) {
    e.preventDefault();
    setUserType(!userType);
    }
 
  async function submit(e) {
    e.preventDefault();

    let url = "http://localhost:5000/register/";
    const data = {
      email: e.target.email.value + "",
      pass: e.target.password.value + "",
      con_pass: e.target.confirm_password.value + "",
      user_type: userType ? "Personal" : "Company",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setResponse(err);
        setMessage(result.error);
      } else {
        setResponse(suc);
        setMessage(result.success);
      }
    } catch (e) {
      setResponse(err);
      setMessage("Somethig went wrong, please try again");
    }

    setTimeout(() => {
      setResponse("");
      setMessage("");
    }, 10000);

    return;
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col w-full h-full text-center p-[20px] gap-[10px]"
    >
      <h1 className="text-center text-[#333333] text-[46px] mb-[20px] mt-[10px] font-bold">
        Register
      </h1>
      <input
        type="email"
        name="email"
        required
        placeholder="email"
        className="p-[10px] border-[1px] border-black text-[16px] w-full rounded-[5px]"
      />
      <input
        type="password"
        name="password"
        required
        placeholder="password"
        className="p-[10px] border-[1px] border-black text-[16px] w-full rounded-[5px]"
      />
      <input
        type="password"
        name="confirm_password"
        required
        placeholder="Confirm password"
        className="p-[10px] border-[1px] border-black text-[16px] w-full rounded-[5px]"
      />
      <button
        onClick={toggle_userType}
        className="p-[10px] bg-[#007bff] text-[#ffffff] border-none rounded-[5px] text-[16px] cursor-pointer w-[100px] transition-[background-color] duration-[300ms] ease-[ease] hover:bg-[#0056b3]"
      >
        {userType ? "Personal" : "Company"}
      </button>

      <button
        type="submit"
        className="p-[10px] bg-[#007bff] text-[#ffffff] border-none rounded-[5px] text-[16px] cursor-pointer w-[100%] transition-[background-color] duration-[300ms] ease-[ease] hover:bg-[#0056b3]"
      >
        Register
      </button>
      <div className={response}>{message}</div>
    </form>
  );
}
