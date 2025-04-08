import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import {
  VscReport,
  VscCircleSlash,
  VscGraph,
  VscCalendar,
  VscHistory,
} from "react-icons/vsc";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getDashboardStats,
  getGamesChartData,
  getRecentAdminActivity,
} from "../services/apiFunctions";

export default function Adminhome() {
  const navigate = useNavigate();
  const [activeBar, setActiveBar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    reports: 0,
    banned: 0,
    activeToday: 0,
    pendingReports: 0,
    bannedThisMonth: 0,
  });
  const [gamesPlayedData, setGamesPlayedData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsResponse, gamesResponse, activityResponse] =
          await Promise.all([
            getDashboardStats(),
            getGamesChartData(),
            getRecentAdminActivity(),
          ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (gamesResponse.success) {
          setGamesPlayedData(gamesResponse.data);
        }

        if (activityResponse.success) {
          setRecentActivity(activityResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
  }, [gamesPlayedData]);

  const handleBoxClick = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <VscCalendar className="mr-1" /> {currentDate}
          </p>
        </div>
        <div className="bg-black text-white py-2 px-4 rounded-md flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs">
            A
          </div>
          <span>Admin</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => handleBoxClick("/dashboard/admin/users")}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-3xl font-bold mt-2 text-black group-hover:translate-x-1 transition-transform">
                {stats.users.toLocaleString()}
              </h3>
            </div>
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
              <FiUsers size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 flex justify-between">
              <span>Active today</span>
              <span className="font-medium">{stats.activeToday}</span>
            </p>
          </div>
        </div>
        <div
          onClick={() => handleBoxClick("/dashboard/admin/reports")}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Reports</p>
              <h3 className="text-3xl font-bold mt-2 text-black group-hover:translate-x-1 transition-transform">
                {stats.reports.toLocaleString()}
              </h3>
            </div>
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
              <VscReport size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 flex justify-between">
              <span>Pending review</span>
              <span className="font-medium">{stats.pendingReports}</span>
            </p>
          </div>
        </div>
        <div
          onClick={() => handleBoxClick("/dashboard/admin/banned")}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Banned Users</p>
              <h3 className="text-3xl font-bold mt-2 text-black group-hover:translate-x-1 transition-transform">
                {stats.banned.toLocaleString()}
              </h3>
            </div>
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
              <VscCircleSlash size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 flex justify-between">
              <span>Banned this month</span>
              <span className="font-medium">{stats.bannedThisMonth}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Total Games Played
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Last 7 days</span>
            <VscGraph />
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={gamesPlayedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onMouseMove={(state) => {
                if (state && state.isTooltipActive) {
                  setActiveBar(state.activeTooltipIndex);
                } else {
                  setActiveBar(null);
                }
              }}
              onMouseLeave={() => setActiveBar(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eaeaea"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                width={30}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "white" }}
                labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                formatter={(value) => [`${value} games`, "Games"]}
                labelFormatter={(label) =>
                  label === "Tue"
                    ? "Tuesday"
                    : label === "Wed"
                    ? "Wednesday"
                    : label === "Thu"
                    ? "Thursday"
                    : label === "Sat"
                    ? "Saturday"
                    : `${label}day`
                }
              />
              <Bar
                dataKey="games"
                fill="#000000"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              >
                {gamesPlayedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={activeBar === index ? "#000000" : "#d1d5db"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm">
            <span className="text-gray-500">Total this week:</span>
            <span className="font-semibold ml-2 text-black">
              {gamesPlayedData
                .reduce((sum, item) => sum + item.games, 0)
                .toLocaleString()}{" "}
              games
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Daily average:</span>
            <span className="font-semibold ml-2 text-black">
              {Math.round(
                gamesPlayedData.reduce((sum, item) => sum + item.games, 0) / 7
              ).toLocaleString()}{" "}
              games
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          {/* <button
            onClick={() => navigate("/dashboard/admin/activity")}
            className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
          >
            <VscHistory /> View all
          </button> */}
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0"
            >
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-black">
                {activity.user ? activity.user.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
