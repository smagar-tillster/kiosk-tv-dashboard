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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Dashboard Card */}
          <Link href="/pages/dashboard">
            <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-500 transition-colors">
                  <BarChart3 className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Main Dashboard</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Complete overview with stats, charts, and alerts for both tenants
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  Store & Kiosk Status
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Order Failure Trends
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  Alert Heatmaps
                </li>
              </ul>
            </div>
          </Link>

          {/* Map Dashboard Card */}
          <Link href="/pages/map-dashboard">
            <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-orange-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-orange-100 rounded-xl group-hover:bg-orange-500 transition-colors">
                  <Map className="h-8 w-8 text-orange-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Map Dashboard</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Geographic view of combined alert distribution across the US
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-orange-500" />
                  Combined BK-US & PLK-US Data
                </li>
                <li className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-orange-500" />
                  State-by-State Breakdown
                </li>
                <li className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-orange-500" />
                  Interactive US Map
                </li>
              </ul>
            </div>
          </Link>

          {/* EU tenants Card */}
          <Link href="/pages/eu-tenants">
            <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-orange-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-orange-100 rounded-xl group-hover:bg-orange-500 transition-colors">
                  <Map className="h-8 w-8 text-orange-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">EU Tenants</h2>
              </div>
              <p className="text-gray-600 mb-4">
                EU tenants view
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-orange-500" />
                    EU tenants data
                </li>
                <li className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-orange-500" />
                  State-by-State Breakdown
                </li>
                <li className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-orange-500" />
                  Interactive US Map
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
