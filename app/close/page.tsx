"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Gunakan useRouter untuk navigasi

const ThankYouPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Set timeout untuk mengarahkan pengguna ke halaman login setelah 5 detik
    const timeoutId = setTimeout(() => {
      // Hapus data dari localStorage
      localStorage.removeItem('token'); // Ganti 'token' dengan nama item yang ingin dihapus
      localStorage.removeItem('role'); // Jika Anda ingin menghapus role juga
      router.push('/login'); // Ganti '/login' dengan path halaman login
    }, 5000);

    // Bersihkan timeout ketika komponen unmount
    return () => clearTimeout(timeoutId);
  }, [router]);

  // Periksa apakah pengguna sudah memberikan suara (bisa menggunakan state atau localStorage)
  useEffect(() => {
    const hasVoted = localStorage.getItem('hasVoted'); // Misalnya Anda simpan status vote di localStorage

    if (hasVoted) {
      // Jika sudah memberikan suara, redirect ke halaman login atau halaman yang sesuai
      router.push('/login'); // Ganti '/login' dengan path halaman login
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">Terima Kasih!</h1>
      <p className="text-lg text-black">Vote Anda telah berhasil disimpan.</p>
      <p className="text-md text-gray-600 mt-4">Anda akan diarahkan ke halaman login dalam 5 detik...</p>
    </div>
  );
};

export default ThankYouPage;
