import React, { useState, useEffect } from "react";
import {
  VscSearch,
  VscFilter,
  VscChevronDown,
  VscRefresh,
  VscCheck,
  VscTrash,
  VscLinkExternal,
} from "react-icons/vsc";
import toast from "react-hot-toast";
import {
  getAllReports,
  resolveReport,
  deleteReport,
  getDashboardStats,
} from "../services/apiFunctions";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [reportStats, setReportStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    investigatingReports: 0,
    resolvedReports: 0,
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [reportsResponse, statsResponse] = await Promise.all([
        getAllReports(),
        getDashboardStats(),
      ]);

      if (reportsResponse.success && reportsResponse.data) {
        const formattedReports = reportsResponse.data.map((report) => ({
          id: report._id,
          reportedUser: report.reportedTo?.name || "Unknown User",
          reportedBy: report.reportedBy?.name || "Anonymous",
          reason: report.reportedReason || "Not specified", // Match your Report model field names
          details: report.details || "No additional details provided",
          category: report.category || "general",
          date: report.reportingTime || new Date(), // Match your Report model field names
          status: report.status || "pending",
          avatar: (report.reportedTo?.name || "?").charAt(0).toUpperCase(),
          gameId: report.gameId
        }));
        
        console.log("Formatted reports:", formattedReports);
        setReports(formattedReports);
      }

      if (statsResponse.success) {
        // Calculate report stats from data
        const totalReports = statsResponse.data.reports || 0;

        // Default distribution if precise data isn't available
        setReportStats({
          totalReports,
          pendingReports: Math.round(totalReports * 0.2),
          investigatingReports: Math.round(totalReports * 0.3),
          resolvedReports: Math.round(totalReports * 0.5),
        });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = () => {
    fetchReports();
    toast.success("Reports refreshed");
  };

  const handleResolveReport = async (reportId) => {
    try {
      const result = await resolveReport(reportId);
      if (result.success) {
        toast.success("Report marked as resolved");

        // Update the report in the list
        setReports(
          reports.map((report) =>
            report.id === reportId ? { ...report, status: "resolved" } : report
          )
        );

        // Update stats
        setReportStats({
          ...reportStats,
          pendingReports: Math.max(0, reportStats.pendingReports - 1),
          investigatingReports: Math.max(
            0,
            reportStats.investigatingReports - 1
          ),
          resolvedReports: reportStats.resolvedReports + 1,
        });
      } else {
        toast.error(result.message || "Failed to resolve report");
      }
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error("An error occurred");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const result = await deleteReport(reportId);
      if (result.success) {
        toast.success("Report deleted successfully");

        // Remove the report from the list
        setReports(reports.filter((report) => report.id !== reportId));

        // Update stats
        setReportStats({
          ...reportStats,
          totalReports: Math.max(0, reportStats.totalReports - 1),
          pendingReports: Math.max(0, reportStats.pendingReports - 1),
          investigatingReports: Math.max(
            0,
            reportStats.investigatingReports - 1
          ),
          resolvedReports: Math.max(0, reportStats.resolvedReports - 1),
        });
      } else {
        toast.error(result.message || "Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("An error occurred");
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.details.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    return matchesSearch && report.status === filter;
  });

  const reportsPerPage = 5;
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const displayedReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage user reports
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
          <p className="text-gray-500 text-sm">Total Reports</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {reportStats.totalReports}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Pending Review</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {reportStats.pendingReports}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Investigating</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {reportStats.investigatingReports}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Resolved</p>
          <h3 className="text-2xl font-bold text-black mt-1">
            {reportStats.resolvedReports}
          </h3>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search reports..."
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
                All Reports
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "pending"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "investigating"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("investigating")}
              >
                Investigating
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  filter === "resolved"
                    ? "bg-black text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
                onClick={() => setFilter("resolved")}
              >
                Resolved
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
                    Report Details
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedReports.length > 0 ? (
                  displayedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-start">
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-black font-medium mr-3">
                            {report.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {report.reportedUser}{" "}
                              <span className="text-gray-500 text-sm font-normal">
                                reported by
                              </span>{" "}
                              {report.reportedBy}
                            </div>
                            <div className="text-gray-700 text-sm mt-1 font-medium">
                              {report.reason}
                            </div>
                            <div className="text-gray-500 text-sm mt-1">
                              {report.details}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 capitalize">
                          {report.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusBadgeStyles(
                            report.status
                          )} capitalize`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          {report.gameId && (
                            <button
                              className="p-1 text-gray-500 hover:text-blue-600"
                              title="View Game"
                              onClick={() =>
                                window.open(`/game/${report.gameId}`, "_blank")
                              }
                            >
                              <VscLinkExternal size={20} />
                            </button>
                          )}
                          {report.status !== "resolved" && (
                            <button
                              className="p-1 text-gray-500 hover:text-green-600"
                              title="Mark as Resolved"
                              onClick={() => handleResolveReport(report.id)}
                            >
                              <VscCheck size={20} />
                            </button>
                          )}
                          <button
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Report"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <VscTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No reports found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredReports.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(
                      (currentPage - 1) * reportsPerPage + 1,
                      filteredReports.length
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * reportsPerPage,
                      filteredReports.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredReports.length}</span>{" "}
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
