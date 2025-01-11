import { Login } from "../components/login-component.jsx";
import { Register } from "../components/register-component.jsx";
import { useState } from "react";
export function Login_register() {
  let [toggle, setToggle] = useState(true);

  let [component, setComponent] = useState(<Login></Login>);

  function toggles() {
    setToggle((toggle = !toggle));

    if (toggle) {
      setComponent((component = <Login togle={toggles}></Login>));
    } else {
      setComponent((component = <Register togle={toggles}></Register>));
    }
  }
  return (
    <div className="w-full flex items-center justify-center h-[100vh]">
      <div className="w-[500px] h-[550px] p-[10px] border-[1px] border-black flex flex-row-reverse justify-center rounded-[10px] relative">
        <button
          onClick={toggles}
          className="switch absolute right-[-26px] top-[48%] w-[50px] h-[50px] text-blanchedalmond border-[1px] border-black rounded-lg hover:bg-[rgb(58,57,57)] bg-white "
        ></button>
        {component}
      </div>
    </div>
  );
}
