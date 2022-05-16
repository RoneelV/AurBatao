import md5 from "md5";
import { auth, firestore } from "../firebase";

// This function stores user information seperately when a user signs up
const userSave = () => {
  let displayName = auth.currentUser?.displayName;
  let uid = auth.currentUser?.uid;
  let email = auth.currentUser?.email;
  let isVerified = auth.currentUser?.emailVerified;
  let md5Hash = md5(email.toLowerCase());
  let avatarUrl = `https://www.gravatar.com/avatar/${md5Hash}?d=${encodeURIComponent(
    "https://bootdey.com/img/Content/avatar/avatar7.png"
  )}`;

  firestore
    .collection("users")
    .doc(uid)
    .set({
      displayName,
      name: displayName,
      avatarUrl,
      email,
      isVerified,
    })
    .then(() => {
      console.log("Document successfully written!", uid, displayName);
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

export default userSave;
