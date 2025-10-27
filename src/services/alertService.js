import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function postAlertToFirestore({ coords, type = "SOS" }) {
  try {
    const docRef = await addDoc(collection(db, "alerts"), {
      coords,
      type,
      timestamp: serverTimestamp(),
      resolved: false,
    });
    console.log("Alert posted:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("postAlert error", err);
    throw err;
  }
}
