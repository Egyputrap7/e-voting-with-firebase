// app/login/page.tsx
'use client'; // Menandai komponen ini sebagai Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Pastikan mengimport db dari konfigurasi Firebase

const LoginPage = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state setiap kali login
    setError("");

    try {
      // Query ke Firestore berdasarkan token yang dimasukkan
      const q = query(collection(db, "users"), where("token", "==", token));
      const querySnapshot = await getDocs(q);

      // Cek apakah ada dokumen yang cocok
if (!querySnapshot.empty) {
  querySnapshot.forEach((doc) => {
      const userData = doc.data();
      localStorage.setItem('uid', userData.uid);

      // Cek role dari data Firestore
      if (userData.role === "admin") {
          router.push("/admin"); // Arahkan ke halaman admin
      } else if (userData.role === "user") {
          // Cek apakah pengguna sudah memberikan suara
          if (userData.hasVoted === undefined || userData.hasVoted === false) {
            // Jika hasVoted tidak ada atau bernilai false
            router.push("/vote");  // Arahkan ke halaman voting
          }
          else {
              router.push("/voteUse"); // Arahkan ke halaman jika sudah memberikan suara
          }
      } else {
          setError("Peran tidak valid."); // Jika role tidak sesuai
      }
  });
} else {
  // Jika tidak ada dokumen yang cocok dengan token
  setError("Token tidak valid. Silakan coba lagi.");
}

    } catch (error) {
      console.error("Error saat memeriksa token:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="token" className="block text-lg font-medium text-gray-700">
              Token
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan token"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
