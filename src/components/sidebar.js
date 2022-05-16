import { useEffect, useState, useContext } from "react";
import { firestore, auth, firebase, database } from "../firebase";
import { LoginContext } from "../LoginContext";
import { timeDifference } from "../utils/timeDifference";

const Sidebar = ({ handler }) => {
  const [user, setUser] = useContext(LoginContext);
  let [value, setValue] = useState({ docs: [] });

  useEffect(() => {
    firestore
      .collection("users")
      .onSnapshot({ includeMetadataChanges: true }, (snapshots) => {
        let tval = [];
        snapshots.forEach((doc) => {
          tval.push(doc);
        });
        setValue({ docs: tval });
      });
  }, []);

  let [snapshots, setSnapshots] = useState([]);
  useEffect(() => {
    database.ref("/presence").on("value", (snaps) => {
      let tsnaps = [];
      snaps.forEach((snap) => {
        if (snap.key != user.user.uid)
          tsnaps.push({ key: snap.key, val: snap.val() });
      });
      setSnapshots(tsnaps);
    });
  }, [user.user.uid]);

  const [presence, setPresence] = useState({});
  const [avatarUrl, setAvatarUrl] = useState("");

  // get current user avatarUrl from value in useEffect
  useEffect(() => {
    if (value) {
      let muser = value.docs.find((doc) => doc.id === user.user.uid);
      setAvatarUrl(muser?.data().avatarUrl);
    }
  }, [value, user]);

  let list = value?.docs.map((doc) => {
    let docd = doc.data();
    let status =
      presence[doc.id] === "online"
        ? "online"
        : `Last seen ${timeDifference(
            new Date(),
            new Date(presence[doc.id] * 1000)
          )}`;
    return doc.id !== user.user.uid ? (
      <li
        className="clearfix"
        key={doc.id}
        onClick={() =>
          handler({
            displayName: docd.displayName,
            uid: doc.id,
            presence: status,
          })
        }
      >
        <img
          src={
            docd.avatarUrl
              ? docd.avatarUrl
              : "https://bootdey.com/img/Content/avatar/avatar7.png"
          }
          alt="avatar"
        />
        <div className="about">
          <div className="name text-truncate">{docd.displayName}</div>
          <div className="status">
            <i className={`fa fa-circle ${status}`}></i> {status}
          </div>
        </div>
      </li>
    ) : (
      ""
    );
  });

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => console.log("signout: " + error));
  };

  // This useEffect finds out who are online
  useEffect(() => {
    snapshots.forEach((v) => {
      if (v.val.online) setPresence((p) => ({ ...p, [v.key]: "online" }));
      else setPresence((p) => ({ ...p, [v.key]: v.val.time.seconds }));
    });
  }, [snapshots, value]);

  // This useEffect tracks if an user is online or not
  useEffect(() => {
    const userId = user.user.uid;

    const reference = database.ref(`/presence/${userId}`);

    reference
      .onDisconnect()
      .set({ online: false, time: firebase.firestore.Timestamp.now() })
      .then(() => console.log("On disconnect function configured."));

    reference
      .set({ online: true })
      .then(() => console.log("Online presence set"));
  }, [user]);

  return (
    <div id="plist" className="people-list">
      <ul className="list-unstyled chat-list mb-0">
        <li className="clearfix user-head-li">
          <img
            src={
              avatarUrl
                ? avatarUrl
                : "https://bootdey.com/img/Content/avatar/avatar7.png"
            }
            alt="avatar"
          />
          <div className="about">
            <div className="name">{user.user.displayName}</div>
          </div>
          <i className="fa fa-sign-out pull-right" onClick={signOut}></i>
        </li>
        {list}
      </ul>
    </div>
  );
};

export default Sidebar;
