import { auth, firestore } from "../firebase";

// This function changes status of a message sent to the use from single tick to double tick
const changeStatus = () => {
  firestore
    .collection("pipeline")
    .doc(auth.currentUser?.uid)
    .collection("sent")
    .onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        // console.log(doc.data());
        firestore
          .collection("messages")
          .doc(doc.data().chatID)
          .collection("messages")
          .doc(doc.data().messageID)
          .update({
            status: "received",
          });
        firestore
          .collection("pipeline")
          .doc(auth.currentUser?.uid)
          .collection("sent")
          .doc(doc.id)
          .delete();
      });
    });
};

export default changeStatus;
