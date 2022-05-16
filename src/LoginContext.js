import { createContext, useState } from "react";

const LoginContext = createContext();

const LoginProvider = (props) => {
  const [user, setUser] = useState(null);

  return (
    <LoginContext.Provider value={[user, setUser]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };