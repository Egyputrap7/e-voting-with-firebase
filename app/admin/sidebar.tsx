"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <nav>
          <ul className="space-y-4">
          <li>
              <Link href="/admin">
                <p className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Home
                </p>
              </Link>
            </li>
            <li>
              <Link href="/admin/token">
                <p className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Generate Token
                </p>
              </Link>
            </li>
            <li>
              <Link href="/admin/monitoring">
                <p className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Monitoring Hasil
                </p>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}
