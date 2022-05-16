import { format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import { firestore, firebase, auth } from "../firebase";
import { LoginContext } from "../LoginContext";

import { MdPhone } from "react-icons/md";
import { MdVideoCall } from "react-icons/md";
import { MdMoreVert } from "react-icons/md";

import "../styles/chat-page-css.css";

const scrollToBottom = (element) => {
  if (element != null) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }
};

const Chat = ({ data, room }) => {
  const [user] = useContext(LoginContext);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [presence, setPresence] = useState();
  const [reciepientData, setReciepientData] = useState();
  const [senderData, setSenderData] = useState();

  const reciepientAvatarUrl = reciepientData?.avatarUrl
    ? reciepientData.avatarUrl
    : "https://bootdey.com/img/Content/avatar/avatar7.png";
  const senderAvatarUrl = senderData?.avatarUrl
    ? senderData.avatarUrl
    : "https://bootdey.com/img/Content/avatar/avatar7.png";

  // const call = "https://www.bootdey.com/img/Content/icons/64/PNG/64/photo.png";
  // const videoCall = "https://www.bootdey.com/img/Content/icons/64/PNG/64/photo.png";
  // const moreOpt = "https://www.bootdey.com/img/Content/icons/64/PNG/64/photo.png";

  useEffect(() => {
    firestore
      .collection("users")
      .doc(data?.uid)
      .get()
      .then((doc) => {
        setReciepientData(doc.data());
      });

    firestore
      .collection("users")
      .doc(user.user.uid)
      .get()
      .then((doc) => {
        setSenderData(doc.data());
      });
  }, [room, data, user]);

  // on page load scroll to bottom
  useEffect(() => {
    if (document.querySelector(".chat-history") !== null) {
      scrollToBottom(document.querySelector(".chat-history"));
    }
  }, [messages]);

  // This useEffect generates messages in between two users
  useEffect(() => {
    if (room) {
      const unsubscribe = firestore
        .collection("messages")
        .doc(room)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          console.log("Fetch Messages");
          setMessages(
            snapshot.docs.map((doc) => {
              if (
                (doc.data().status === "sent" ||
                  doc.data().status === "received") &&
                doc.data().sentBy !== user.user.uid
              )
                firestore
                  .collection("messages")
                  .doc(room)
                  .collection("messages")
                  .doc(doc.id)
                  .update({
                    status: "seen",
                  });
              //   if (
              //     doc.data().status === "sent" &&
              //     presence === "online" &&
              //     doc.data().sentBy === user.user.uid
              //   )
              //     firestore
              //       .collection("messages")
              //       .doc(room)
              //       .collection("messages")
              //       .doc(doc.id)
              //       .update({
              //         status: "received",
              //       });
              return { ...doc.data(), id: doc.id };
            })
          );
        });
      // unsubscribe from firestore
      return () => {
        unsubscribe();
      };
    }
  }, [room, presence, user]);

  // This useEffect checks if the receiver is online or not
  // useEffect(() => {
  //   snapshots.map((v) => {
  //     if (v.val()?.seconds)
  //       setPresence((p) => `Last seen at ${new Date(v.val()?.seconds * 1000).toLocaleString()}`);
  //     else setPresence((p) => "online");
  //   });
  // }, [snapshots]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input === "") return;
    let status = presence === "online" ? "received" : "sent";
    firestore
      .collection("messages")
      .doc(room)
      .collection("messages")
      .add({
        message: input,
        sentBy: user.user.uid,
        sender: user.user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status,
      })
      .then((doc) => {
        if (presence !== "online") {
          firestore
            .collection("pipeline")
            .doc(data?.uid)
            .collection("sent")
            .add({ room, id: doc?.id });
        }
      });
    setInput("");
  };

  const renderAllMessages = () => {
    return messages.map((message, i) => {
      let textClassName =
        message.sentBy == user.user.uid
          ? "message other-message float-right"
          : "message my-message";

      // let isPrevBySameUser = i > 0 && message.sentBy === messages[i - 1].sentBy;

      return (
        <li className="clearfix" key={message.id}>
          <div className={textClassName}>
            <div
              style={{
                position: "relative",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              <span>{message.message}</span>
              <span className="emptyspan"></span>
            </div>
            <div
              className="float-end"
              style={{ lineHeight: "normal", margin: "-10px 0 -4px 5px" }}
            >
              {message?.timestamp ? (
                <span className="message-data-time ms-auto">
                  {format(
                    new Date(message.timestamp?.seconds * 1000),
                    "hh:mm a"
                  )}
                </span>
              ) : (
                <></>
              )}
              {message.sentBy == user.user.uid ? (
                <span className="ms-1">
                  <img
                    src={`/${message.status}.svg`}
                    height={16}
                    width={16}
                    alt={message.status}
                    style={{ marginTop: -2 }}
                  />
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </li>
      );
    });
  };

  return data === null ? (
    ""
  ) : (
    <div className="chat">
      <div className="chat-header clearfix">
        <div className="row">
          <div className="col-lg-6">
            <a href="#">
              <img src={reciepientAvatarUrl} alt="avatar" />
            </a>
            <div className="chat-about">
              <h6 className="m-b-0">{data?.displayName}</h6>
              <small>{presence}</small>
            </div>
          </div>
          <div className="col-lg-6 calling-menu">
            {/* <div className="calling-menu-elements">

            </div>
            <div className="calling-menu-elements">
              
            </div>
            <div className="calling-menu-elements">
              
            </div> */}

            <MdPhone className="calling-menu-elements" />
            <MdVideoCall className="calling-menu-elements" />
            <MdMoreVert className="calling-menu-elements" />
          </div>
        </div>
      </div>
      <div className="chat-history">
        <ul className="m-b-0">{renderAllMessages()}</ul>
      </div>
      <div className="chat-message clearfix">
        <div className="input-group mb-0">
          <input
            type="text"
            className="form-control"
            placeholder={
              auth?.currentUser.emailVerified
                ? "Enter text here..."
                : "Please verify your email"
            }
            value={input}
            disabled={!auth?.currentUser.emailVerified}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : "")}
            style={{ borderRadius: "20px", background: "#faf2e9" }}
          />
          <div className="input-group-prepend">
            <span
              className="input-group-text"
              onClick={sendMessage}
              style={{
                height: "100%",
                borderRadius: "20px",
                background: "#583101",
                color: "white",
              }}
            >
              <i className="fa fa-paper-plane"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
