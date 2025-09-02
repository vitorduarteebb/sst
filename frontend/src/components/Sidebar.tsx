'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Usuários', href: '/users', icon: '👥' },
  { name: 'Empresas', href: '/empresas', icon: '🏢' },
  { name: 'Unidades', href: '/unidades', icon: '🏭' },
  { name: 'Ordens de Serviço', href: '/ordens-servico', icon: '📋' },
  { name: 'Treinamentos', href: '/treinamentos', icon: '🎓' },
  { name: 'Certificados', href: '/certificados', icon: '📜' },
  { name: 'Relatórios', href: '/relatorios', icon: '📊' },
  { name: 'Configurações', href: '/configuracoes', icon: '⚙️' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && (
            <h1 className="text-xl font-bold">SST Platform</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        {user && !collapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.nome?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user.nome || user.email}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <span className="mr-2">🚪</span>
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
