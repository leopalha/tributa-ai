import React, { useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, User, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AriaAssistant } from '@/components/chat/AriaAssistant';
import { Sidebar } from '@/components/layout/Sidebar';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Toaster } from 'sonner';

// Componente do Header
const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="md:hidden p-2 rounded-md hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="ml-4 flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar TCs, transações, bots..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Center */}
          <NotificationCenter />

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Usuário Demo</p>
              <p className="text-xs text-gray-500">demo@tributa.ai</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

interface DashboardLayoutProps {
  children?: ReactNode;
}

// Componente principal do DashboardLayout
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop - usando nosso componente unificado */}
      <Sidebar />

      {/* Sidebar Mobile Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white">
          <div className="flex items-center justify-between p-4 h-16">
            <Link to="/" className="flex items-center cursor-pointer gap-2.5">
              <div
                style={{ width: '2rem', height: '2rem' }}
                className="rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold"
              >
                T
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white">
                Tributa.AI
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="p-6">
          {children || <Outlet />}
        </main>
      </div>

      <Toaster richColors position="top-right" expand={true} duration={4000} />

      {/* ARIA Assistant */}
      <AriaAssistant />
    </div>
  );
}
