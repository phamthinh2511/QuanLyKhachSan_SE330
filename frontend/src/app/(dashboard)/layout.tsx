import Sidebar from "@/components/ui/Sidebar";
import ChatbotWidget from "@/components/ui/ChatbotWidget";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>
      <main className="flex-1 overflow-auto">{children}</main>
      <ChatbotWidget />
    </div>
  );
}