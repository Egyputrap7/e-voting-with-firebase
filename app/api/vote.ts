import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

// Fungsi untuk menyimpan hasil vote
export const submitVote = async (candidateId: number) => {
  const candidateRef = doc(db, "candidates", `candidate-${candidateId}`);
  
  try {
    await updateDoc(candidateRef, {
      votes: increment(1),
    });
    return true;
  } catch (error) {
    console.error("Gagal menyimpan vote", error);
    return false;
  }
};
