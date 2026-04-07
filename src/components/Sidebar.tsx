'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/euka', label: 'Euka Tests', icon: '💬' },
  { href: '/email', label: 'Email Tests', icon: '📧' },
  { href: '/messages', label: 'Message Library', icon: '📝' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-50">
      {/* Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-tight">Fyne Skincare</h1>
        <p className="text-xs text-gray-400 mt-1">A/B Testing Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white border-r-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        Data from Google Sheets
        <br />
        Updates every 60s
      </div>
    </aside>
  );
}
