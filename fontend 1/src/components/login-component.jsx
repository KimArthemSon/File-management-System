
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Login({ togle }) {
  let navigate = useNavigate();
  let [err, setErr] = useState();
  let [messageErr, setMessageErr] = useState();

  async function submit(e) {
    e.preventDefault();

    const url = "http://localhost:5000/login";

    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value + "",
          pass: e.target.password.value + "",
        }),
      });

      if (!result.ok) {
        const data = await result.json();
        setMessageErr((messageErr = data.error));
        setErr((err = <Error error={messageErr} />));
        setTimeout(() => {
          setMessageErr((messageErr = null));
          setErr((err = null));
        }, 10000);

        return;
      }

      navigate("/home");
    } catch (e) {
      setMessageErr((messageErr = "Failed to connect to the server."));
      setErr((err = <Error error={messageErr} />));
      setTimeout(() => {
        setMessageErr((messageErr = null));
        setErr((err = null));
      }, 10000);

      return;
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col text-center items-center w-full h-full">
      <h1 className="text-[55px] mt-[70px] mb-[30px] font-bold">Login</h1>
      <input type="email" name="email" required placeholder="email" className="p-[5px] w-[400px] h-[40px] text-[14px] rounded-[10px] mt-[20px] border-[1px] border-black"/>
      <input type="password" name="password" required placeholder="password" className="p-[5px] w-[400px] h-[40px] text-[14px] rounded-[10px] mt-[20px] border-[1px] border-black"/>
      <button type="submit" className="p-[5px] w-[400px] h-[40px] text-[17px] rounded-[10px] mt-[20px] bg-[#007bff] text-[white] font-bold hover:bg-[#0056b3]">Login</button>
      {err}
    </form>
  );
}

function Error(message) {
  return (
    <div className="p-[5px] w-[400px] h-[40px] text-[14px] rounded-[10px] mt-[20px] border border-red-500">
      <h2 className="flex items-center justify-center h-[100%] text-[16px]">{message.error}</h2>
    </div>
  );
}
