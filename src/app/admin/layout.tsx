import { AdminSidebar, AdminMobileHeader } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background">
      <AdminMobileHeader />
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}


