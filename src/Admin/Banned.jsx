import React, { useState, useEffect } from "react";
import {
  VscSearch,
  VscFilter,
  VscChevronDown,
  VscRefresh,
  VscDebugDisconnect,
  VscCheck,
  VscInfo,
} from "react-icons/vsc";
import toast from "react-hot-toast";
import { getAllBannedUsers, unbanUser, getDashboardStats } from "../services/apiFunctions";

export default function Banned() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [bannedStats, setBannedStats] = useState({
    totalBanned: 0,
    bannedThisMonth: 0,
    permanentBans: 0,
    temporaryBans: 0
  });

  const fetchBannedUsers = async () => {
    try {
      setLoading(true);
      const [bannedResponse, statsResponse] = await Promise.all([
        getAllBannedUsers(),
        getDashboardStats()
      ]);

      if (bannedResponse.success) {
        const formattedUsers = bannedResponse.data.map(user => ({
          id: user._id,
          username: user.name || "Unknown",
          email: user.email || "No email",
          bannedDate: user.bannedDate || new Date(),
          reason: user.banReason || "Violation of terms",
          violationsCount: user.reports?.length || 1,
          bannedBy: user.bannedBy || "System",
          avatar: user.name ? user.name.charAt(0).toUpperCase() : "U"
        }));
        
        setBannedUsers(formattedUsers);
      }

      if (statsResponse.success) {
        // Calculate stats from the banned users data
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        
        const totalBanned = statsResponse.data.banned || 0;
        const bannedThisMonth = bannedResponse.data 
          ? bannedResponse.data.filter(user => 
              new Date(user.bannedDate) >= oneMonthAgo).length 
          : Math.round(totalBanned * 0.3);
          
        setBannedStats({
          totalBanned: totalBanned,
          bannedThisMonth: bannedThisMonth,
          permanentBans: Math.round(totalBanned * 0.6), 
          temporaryBans: Math.round(totalBanned * 0.4)
        });
      }
    } catch (error) {
      console.error("Error fetching banned users:", error);
      toast.error("Failed to load banned users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const handleRefresh = () => {
    fetchBannedUsers();
    toast.success("Banned users data refreshed");
  };

  const handleUnban = async (userId) => {
    try {
      const result = await unbanUser(userId);
      if (result.success) {
        toast.success("User unbanned successfully");
        // Remove from banned list
        setBannedUsers(bannedUsers.filter(user => user.id !== userId));
        // Update stats
        setBannedStats({
          ...bannedStats,
          totalBanned: Math.max(0, bannedStats.totalBanned - 1),
          temporaryBans: Math.max(0, bannedStats.temporaryBans - 1)
        });
      } else {
        toast.error(result.message || "Failed to unban user");
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("An error occurred");
    }
  };

  const filteredUsers = bannedUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.reason.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "recent")
      return (
        matchesSearch &&
        new Date(user.bannedDate) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    if (filter === "repeat") return matchesSearch && user.violationsCount > 3;
    return matchesSearch;
  });

  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banned Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage users who have been banned from the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center gap-2"
            onClick={handleRefresh}
            disabled={loading}
          >
            <VscRefresh className={loading ? "animate-spin" : ""} /> 
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Banned</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {bannedStats.totalBanned}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Banned This Month</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {bannedStats.bannedThisMonth}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Permanent Bans</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {bannedStats.permanentBans}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Temporary Bans</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {bannedStats.temporaryBans}
          </h3>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search banned users..."
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <VscSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              className="border border-gray-300 rounded-md py-2 px-4 flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <VscFilter /> Filter{" "}
              <VscChevronDown
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-4">
            <h3 className="font-medium mb-2">Filter by ban status</h3>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "all"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("all")}
              >
                All Bans
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "recent"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("recent")}
              >
                Recent (7 days)
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "repeat"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("repeat")}
              >
                Repeat Offenders
              </button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banned On
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Violations
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banned By
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-black font-medium mr-3">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {new Date(user.bannedDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          {user.reason}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {user.violationsCount}
                      </td>
                      <td className="py-4 px-4 text-gray-500">{user.bannedBy}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 text-gray-500 hover:text-black"
                            title="View Details"
                          >
                            <VscInfo size={20} />
                          </button>
                          <button
                            className="p-1 text-gray-500 hover:text-green-600"
                            title="Unban User"
                            onClick={() => handleUnban(user.id)}
                          >
                            <VscCheck size={20} />
                          </button>
                          <button
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Permanent Ban"
                          >
                            <VscDebugDisconnect size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No banned users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(
                      (currentPage - 1) * usersPerPage + 1,
                      filteredUsers.length
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * usersPerPage, filteredUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredUsers.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === index + 1
                          ? "bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
