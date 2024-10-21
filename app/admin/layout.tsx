// app/admin/layout.tsx
'use client';

import Sidebar from "./sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6 bg-blue-400">{children}</div>
    </div>
  );
};

export default AdminLayout;
