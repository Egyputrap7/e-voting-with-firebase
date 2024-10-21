"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore"; // Firebase Firestore
import { db } from "@/app/firebase"; // Firebase configuration

interface Candidate {
  name: string;
  votes: number;
}

const MonitoringPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0); // Menyimpan total suara
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "votes"), (snapshot) => {
      const voteCount: { [key: string]: number } = {}; // Menyimpan total suara per kandidat

      // Menghitung total suara untuk setiap kandidat
      snapshot.forEach((doc) => {
        const voteData = doc.data();
        const selectedOption = voteData.selectedOption;

        // Jika selectedOption tidak ada, lewati
        if (selectedOption) {
          if (voteCount[selectedOption]) {
            voteCount[selectedOption]++;
          } else {
            voteCount[selectedOption] = 1;
          }
        }
      });

      // Siapkan data kandidat
      const candidatesData: Candidate[] = [
        { name: "Kandidat 1", votes: voteCount[1] || 0 },
        { name: "Kandidat 2", votes: voteCount[2] || 0 },
        { name: "Kandidat 3", votes: voteCount[3] || 0 },
        { name: "Kandidat 4", votes: voteCount[4] || 0 },
      ];

      setCandidates(candidatesData);

      // Hitung total suara
      const total = candidatesData.reduce((acc, candidate) => acc + candidate.votes, 0);
      setTotalVotes(total);

      setLoading(false); // Set loading ke false setelah data berhasil diambil
    });

    return () => unsubscribe(); // Unsubscribe dari listener saat komponen unmounted
  }, []);

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Monitoring Hasil Pemilihan</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center text-black">Total Suara: {totalVotes}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-4 py-2 border">Nama Kandidat</th>
                  <th className="px-4 py-2 border">Jumlah Suara</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors duration-200 text-black">
                    <td className="px-4 py-2 border text-center">{candidate.name}</td>
                    <td className="px-4 py-2 border text-center">{candidate.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MonitoringPage;
