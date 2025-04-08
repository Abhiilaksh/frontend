import React, { useState, useEffect } from "react";
import {
  VscSearch,
  VscFilter,
  VscTrash,
  VscCircleSlash,
  VscInfo,
  VscChevronDown,
  VscRefresh,
} from "react-icons/vsc";
import {
  getAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  getDashboardStats,
} from "../services/apiFunctions";
import toast from "react-hot-toast";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
    bannedTotal: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersResponse = await getAllUsers();
      const statsResponse = await getDashboardStats();

      if (usersResponse.success && usersResponse.data) {
        const formattedUsers = usersResponse.data.map((user) => ({
          id: user._id,
          username: user.name,
          email: user.email,
          status: user.isBanned ? "banned" : "active",
          lastActive: "Recently",
          registeredDate: user.JoinedDate || new Date(),
          gamesPlayed: user.gamesHistory?.length || 0,
          winRate: `${
            user.wins
              ? Math.round(
                  (user.wins / (user.wins + user.loses + user.draws || 1)) * 100
                )
              : 0
          }%`,
          avatar: user.name?.charAt(0).toUpperCase() || "U",
        }));
        setUsers(formattedUsers);
      }

      if (statsResponse.success) {
        setUserStats({
          totalUsers: statsResponse.data.users || 0,
          activeToday: statsResponse.data.activeToday || 0,
          newThisWeek: Math.round(statsResponse.data.users * 0.15) || 0, // Approximation
          bannedTotal: statsResponse.data.banned || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers();
    toast.success("User data refreshed");
  };

  const handleBanUser = async (userId) => {
    try {
      const result = await banUser(userId);
      if (result.success) {
        toast.success("User banned successfully");
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: "banned" } : user
          )
        );
      } else {
        toast.error(result.message || "Failed to ban user");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("An error occurred");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const result = await unbanUser(userId);
      if (result.success) {
        toast.success("User unbanned successfully");
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: "active" } : user
          )
        );
      } else {
        toast.error(result.message || "Failed to unban user");
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("An error occurred");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && user.status === filter;
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
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all registered users in the system
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
          <p className="text-gray-500 text-sm">Total Users</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {userStats.totalUsers.toLocaleString()}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Active Today</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {userStats.activeToday.toLocaleString()}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">New This Week</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {userStats.newThisWeek.toLocaleString()}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Banned Users</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {userStats.bannedTotal.toLocaleString()}
          </h3>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search users..."
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
            <h3 className="font-medium mb-2">Filter by status</h3>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "all"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "active"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "banned"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("banned")}
              >
                Banned
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
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Games
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win Rate
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
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : user.status === "banned"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status}
                        </span>
                        <div className="text-gray-500 text-sm mt-1">
                          {user.lastActive}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {new Date(user.registeredDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {user.gamesPlayed}
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {user.winRate}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 text-gray-500 hover:text-black"
                            title="View User Details"
                          >
                            <VscInfo size={20} />
                          </button>
                          {user.status === "banned" ? (
                            <button
                              className="p-1 text-gray-500 hover:text-green-600"
                              title="Unban User"
                              onClick={() => handleUnbanUser(user.id)}
                            >
                              <VscCircleSlash size={20} />
                            </button>
                          ) : (
                            <button
                              className="p-1 text-gray-500 hover:text-red-600"
                              title="Ban User"
                              onClick={() => handleBanUser(user.id)}
                            >
                              <VscCircleSlash size={20} />
                            </button>
                          )}
                          <button
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete User"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <VscTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No users found matching your filters.
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
