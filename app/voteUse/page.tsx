"use client";

const VoteUsePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-600">Voting Anda Telah Diterima!</h1>
        <p className="text-lg text-gray-700 text-center mb-4">
          Terima kasih telah memberikan suara Anda! Kami menghargai partisipasi Anda dalam pemilihan ini.
        </p>
        <p className="text-md text-gray-600 text-center mb-6">
          Jika Anda memiliki pertanyaan atau ingin melihat hasil pemilihan, silakan kunjungi halaman admin.
        </p>

        <div className="flex flex-col items-center mt-4">
          <button
            onClick={() => window.location.href = '/'} // Ganti dengan path yang sesuai
            className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteUsePage;
