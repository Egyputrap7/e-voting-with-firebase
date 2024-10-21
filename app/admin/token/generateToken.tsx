'use client';

import { useState } from "react";
import { db } from "@/app/firebase"; // Pastikan Anda sudah mengonfigurasi Firebase
import { collection, addDoc } from "firebase/firestore"; 
import { useRouter } from "next/navigation";

const CreateUserPage = () => {
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("user"); // Default untuk pemilih
  const [error, setError] = useState("");
  const router = useRouter();

  // Fungsi untuk menghasilkan UID dan Token secara acak
  const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleGenerate = () => {
    const newUid = generateRandomString(10); // Panjang UID yang diinginkan
    const newToken = generateRandomString(5); // Panjang Token yang diinginkan
    setUid(newUid);
    setToken(newToken);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!uid || !token) {
      setError("UID dan token harus diisi.");
      return;
    }

    try {
      // Menambahkan akun pemilih ke Firestore
      const docRef = await addDoc(collection(db, "users"), {
        uid: uid,
        token: token,
        role: role,
      });
      console.log("Document written with ID: ", docRef.id);
      router.push("/admin"); // Setelah berhasil, kembali ke halaman admin
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Gagal menambahkan akun. Silakan coba lagi.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buat Akun Pemilih</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div>
          <label htmlFor="uid" className="block text-sm font-medium text-gray-700">
            UID
          </label>
          <input
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md text-black"
            required
          />
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-2 bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700"
          >
            Generate Token
          </button>
        </div>
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
            Token
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-2 rounded-md text-black"
            required
          />
        </div>
   
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Tambah Akun
        </button>
      </form>
    </div>
  );
};

export default CreateUserPage;
