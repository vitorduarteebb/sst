'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Usuários', href: '/users', icon: '👥' },
    { name: 'Empresas', href: '/empresas', icon: '🏢' },
    { name: 'Unidades', href: '/unidades', icon: '🏭' },
    { name: 'Ativos', href: '/ativos', icon: '📦' },
    { name: 'Ordens de Serviço', href: '/ordens-servico', icon: '📋' },
    { name: 'Treinamentos', href: '/treinamentos', icon: '🎓' },
    { name: 'Certificados', href: '/certificados', icon: '📜' },
    { name: 'Relatórios', href: '/relatorios', icon: '📊' },
    { name: 'Configurações', href: '/configuracoes', icon: '⚙️' },
  ];

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <h2 className="text-xl font-bold">SST</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-gray-700"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded hover:bg-gray-700 transition-colors ${
                    pathname === item.href ? 'bg-blue-600' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {user && !isCollapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                {user.nome?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.nome || user.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
