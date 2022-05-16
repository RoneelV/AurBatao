import { useContext, useState } from "react";

import Sidebar from "./components/sidebar";
// import TopBar from "./components/TopBar";
import Chat from "./components/chat";
import SignIn from "./components/signIn";
import { LoginContext } from "./LoginContext";

import "./styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

function App() {
  const [user] = useContext(LoginContext);
  const [info, setInfo] = useState(null);
  const [room, setRoom] = useState(null);
  const handler = (obj) => {
    if (obj?.uid != undefined && user?.user.uid != undefined) {
      if (obj?.uid < user?.user.uid) setRoom(obj?.uid + user?.user.uid);
      else setRoom(user?.user.uid + obj?.uid);
    }
    setInfo(obj);
  };
  return (
    <div className="app">
      {!user ? (
        <SignIn />
      ) : (
        <div className="app__container">
          {/* <TopBar /> */}
          <div className="container">
            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card chat-app">
                  <Sidebar handler={handler} />
                  <Chat data={info} room={room} />
                </div>
              </div>
            </div>
          </div>
          <link
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
            rel="stylesheet"
          />
        </div>
      )}
    </div>
  );
}

export default App;
