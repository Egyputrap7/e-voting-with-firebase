"use client";

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, getDocs, query, where } from "firebase/firestore"; // Firebase Firestore
import { db } from "../firebase"; // Firebase configuration
import { useRouter } from 'next/navigation';

interface Option {
  id: number;
  name: string;
  imageUrl: string;
}

const options: Option[] = [
  { id: 1, name: 'Pilihan 1', imageUrl: '/images/pict.jpg' },
  { id: 2, name: 'Pilihan 2', imageUrl: '/images/pict.jpg' },
  { id: 3, name: 'Pilihan 3', imageUrl: '/images/pict.jpg' },
  { id: 4, name: 'Pilihan 4', imageUrl: '/images/pict.jpg' },
];

const VotePage = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean | null>(null); // Tambahkan state untuk hasVoted
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State untuk modal

  const router = useRouter(); // Gunakan useRouter untuk navigasi

  useEffect(() => {
    // Mendapatkan UID dari localStorage setelah login
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUid(storedUid);
      checkVotingStatus(storedUid); // Cek status voting
    } else {
      setError("UID tidak ditemukan. Silakan login kembali.");
    }
  }, []);

  // Fungsi untuk memeriksa apakah pengguna sudah memberikan suara
  const checkVotingStatus = async (uid: string) => {
    const userQuery = query(collection(db, "users"), where("uid", "==", uid));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      setError("Pengguna tidak ditemukan.");
      return;
    }

    const userDoc = userSnapshot.docs[0]; // Ambil dokumen pertama yang ditemukan
    const userData = userDoc.data();

    if (userData.hasVoted) {
      setHasVoted(true); // Set hasVoted jika sudah memberikan suara
      setError("Anda sudah memberikan suara. Terima kasih!");
    }
  };

  // Fungsi untuk menyimpan data ke Firestore
  const submitVote = async () => {
    if (!selectedOption || !uid) {
      setError("Silakan pilih opsi dan pastikan Anda sudah login.");
      return;
    }

    try {
      // Tambahkan dokumen baru ke koleksi "votes" di Firestore
      await addDoc(collection(db, "votes"), {
        uid: uid, // UID pengguna dari localStorage
        selectedOption, // Opsi yang dipilih
        timestamp: new Date() // Waktu vote
      });

      // Memperbarui dokumen pengguna untuk menandai bahwa pengguna sudah memberikan suara
      const userQuery = query(collection(db, "users"), where("uid", "==", uid));
      const userSnapshot = await getDocs(userQuery);
      const userDoc = userSnapshot.docs[0];

      await updateDoc(userDoc.ref, { hasVoted: true });

      setSuccessMessage("Vote berhasil disimpan!");
      setError(null); // Reset pesan error jika berhasil
      router.push("/close");
    } catch (error) {
      console.error("Error submitting vote:", error);
      setError("Terjadi kesalahan saat menyimpan vote. Silakan coba lagi.");
    }
  };

  const handleSelect = (id: number) => {
    setSelectedOption(id);
  };
  const handleSubmitClick = () => {
    // Tampilkan modal konfirmasi
    setIsModalOpen(true);
  };

  const handleConfirmVote = () => {
    // Jika pengguna mengonfirmasi, kirim suara
    submitVote();
    setIsModalOpen(false); // Tutup modal setelah konfirmasi
  };

  const handleCancelVote = () => {
    // Tutup modal tanpa mengirim suara
    setIsModalOpen(false);
  };

  if (hasVoted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-black">Voting Selesai</h1>
        <p className="text-lg text-gray-600">Anda sudah memberikan suara. Terima kasih!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Pilih Opsi Anda</h1>
      <div className="grid grid-cols-4 gap-6">
        {options.map((option) => (
          <div
            key={option.id}
            className={`border-2 p-4 rounded-lg cursor-pointer transition-all duration-100 ${
              selectedOption === option.id ? 'border-indigo-500' : 'border-gray-300'
            }`}
            onClick={() => handleSelect(option.id)}
          >
            <img
              src={option.imageUrl}
              alt={option.name}
              className="w-60 h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-center text-lg font-semibold text-black">{option.name}</p>
          </div>
        ))}
      </div>

      {selectedOption && (
        <p className="mt-6 text-xl font-bold text-indigo-600">
          Anda memilih: {options.find((option) => option.id === selectedOption)?.name}
        </p>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

      <button
        onClick={handleSubmitClick}
        className="mt-6 bg-indigo-500 text-white py-4 px-6 rounded-lg hover:bg-indigo-700"
        disabled={hasVoted !== null && hasVoted} // Nonaktifkan button jika sudah voting
      >
        Kirim Pilihan
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-black">Konfirmasi Vote</h2>
            <p className="mb-4 text-black">Apakah Anda yakin ingin memberikan suara untuk {options.find((option) => option.id === selectedOption)?.name}?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelVote}
                className="bg-gray-300 text-black py-1 px-4 rounded-md hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmVote}
                className="bg-indigo-500 text-white py-1 px-4 rounded-md hover:bg-indigo-700"
              >
                Ya, Kirim Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotePage;
