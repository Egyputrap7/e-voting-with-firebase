'use client';

import { useEffect, useState } from "react";
import { db } from "@/app/firebase"; // Pastikan Anda sudah mengonfigurasi Firebase
import { collection, getDocs } from "firebase/firestore"; 

const MonitoringPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedCount, setVotedCount] = useState(0);
  const [notVotedCount, setNotVotedCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData: any[] = [];
        let voted = 0; // Counter untuk pengguna yang sudah voting
        let notVoted = 0; // Counter untuk pengguna yang belum voting

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          // Hanya ambil pengguna dengan role "user"
          if (userData.role === "user") {
            usersData.push({
              id: doc.id,
              uid: userData.uid,
              token: userData.token,
              hasVoted: userData.hasVoted, // Menggunakan boolean langsung
            });
            
            // Hitung pengguna yang sudah dan belum voting
            if (userData.hasVoted) {
              voted++;
            } else {
              notVoted++;
            }
          }
        });

        setUsers(usersData);
        setVotedCount(voted);
        setNotVotedCount(notVoted);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Monitoring Pengguna</h1>
      
      {/* Tampilkan total pengguna yang sudah dan belum memilih */}
      <div className="mb-4">
        <p className="text-lg">Total Sudah Memilih: <span className="font-bold text-red-500">{votedCount}</span></p>
        <p className="text-lg">Total Belum Memilih: <span className="font-bold text-blue-500">{notVotedCount}</span></p>
      </div>

      <table className="min-w-full bg-white border text-black border-blue-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">No</th>
            <th className="px-4 py-2 border">UID</th>
            <th className="px-4 py-2 border">Token</th>
            <th className="px-4 py-2 border">Status Voting</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center border py-4">Tidak ada pengguna.</td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border text-center">{index + 1}</td> {/* Menambahkan nomor urut */}
                <td className="px-4 py-2 border">{user.uid}</td>
                <td className="px-4 py-2 border">{user.token}</td>
                <td className={`px-4 py-2 border font-bold ${user.hasVoted ? 'text-red-500' : 'text-blue-500'}`}>
                  {user.hasVoted ? 'Sudah Voting' : 'Belum Voting'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonitoringPage;
