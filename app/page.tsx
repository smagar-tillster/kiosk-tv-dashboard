'use client';

import Link from 'next/link';
import { BarChart3, Map, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#f97316' }}>
            Tillster Proactive Monitoring
          </h1>
          <p className="text-xl text-gray-600">
            Real-time monitoring and analytics for BK-US & PLK-US
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Dashboard Card */}
          <Link href="/pages/dashboard">
            <div className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <BarChart3 className="h-6 w-6 text-blue-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Main Dashboard</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Complete overview with stats, charts, and alerts for both tenants
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-green-500" />
                  Store & Kiosk Status
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-blue-500" />
                  Order Failure Trends
                </li>
              </ul>
            </div>
          </Link>

          {/* BK-US Dashboard Card */}
          <Link href="/bk-us-dashboard">
            <div className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-emerald-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-500 transition-colors">
                  <BarChart3 className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">BK-US Dashboard</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Burger King US dedicated dashboard with maps and charts
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  Real-time Kiosk Status
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  Order Failure Analytics
                </li>
              </ul>
            </div>
          </Link>

          {/* PLK-US Dashboard Card */}
          <Link href="/plk-us-dashboard">
            <div className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-500 transition-colors">
                  <BarChart3 className="h-6 w-6 text-orange-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">PLK-US Dashboard</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Popeyes US dedicated dashboard with maps and charts
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-orange-500" />
                  Real-time Kiosk Status
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-orange-500" />
                  Order Failure Analytics
                </li>
              </ul>
            </div>
          </Link>

          {/* Exec Dashboard Card */}
          <Link href="/exec-dashboard">
            <div className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-teal-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-teal-100 rounded-lg group-hover:bg-teal-500 transition-colors">
                  <Activity className="h-6 w-6 text-teal-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Exec Dashboard</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Executive view with kiosk status maps for both tenants
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <Map className="h-3 w-3 text-teal-500" />
                  Kiosk Status Maps
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-teal-500" />
                  Real-time Stats
                </li>
              </ul>
            </div>
          </Link>

          {/* Map Dashboard Card */}
          <Link href="/pages/map-dashboard">
            <div className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors">
                  <Map className="h-6 w-6 text-purple-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Map Dashboard</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Geographic view of combined alert distribution across the US
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <Map className="h-3 w-3 text-purple-500" />
                  Combined BK & PLK Data
                </li>
                <li className="flex items-center gap-2">
                  <Map className="h-3 w-3 text-purple-500" />
                  Interactive US Map
                </li>
              </ul>
            </div>
          </Link>

          {/* EU Tenants Card */}
          <Link href="/pages/eu-tenants">
            <div className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-indigo-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-500 transition-colors">
                  <Map className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">EU Tenants</h2>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                European tenants monitoring view
              </p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <Map className="h-3 w-3 text-indigo-500" />
                  EU Tenants Data
                </li>
                <li className="flex items-center gap-2">
                  <Map className="h-3 w-3 text-indigo-500" />
                  State-by-State View
                </li>
              </ul>
            </div>
          </Link>
        
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by NewRelic Analytics • Real-time Data Updates</p>
        </div>
      </div>
    </div>
  );
}
