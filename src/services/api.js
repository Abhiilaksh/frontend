import { apiConnector } from "./apiConnector";

const BASE_URL = "http://localhost:8080";

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  login: async (email, password) => {
    return await apiConnector("POST", `${BASE_URL}/api/login`, {
      email,
      password,
    });
  },
  signup: async (email, password, name) => {
    return await apiConnector("POST", `${BASE_URL}/api/signup`, {
      email,
      password,
      name,
    });
  },
  verifyToken: async (token) => {
    return await apiConnector(
      "POST",
      `${BASE_URL}/api/verifytokenAndGetUsername`,
      { token }
    );
  },
  requestPasswordReset: async (email) => {
    return await apiConnector("POST", `${BASE_URL}/api/resetPasswordToken`, {
      email,
    });
  },
  resetPassword: async (token, password) => {
    return await apiConnector(
      "PATCH",
      `${BASE_URL}/api/resetPassword/${token}`,
      { password }
    );
  },
  verifyEmail: async (token) => {
    return await apiConnector("GET", `${BASE_URL}/api/verify/${token}`);
  },
  checkVerified: async (name) => {
    return await apiConnector("POST", `${BASE_URL}/api/isVerified`, { name });
  },
};

// ==================== USER ENDPOINTS ====================
export const userAPI = {
  getUserById: async (id, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/user/${id}`,
      null,
      headers
    );
  },
  getUserByUsername: async (username) => {
    return await apiConnector("POST", `${BASE_URL}/api/getUser`, { username });
  },
  deleteUser: async (id, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "DELETE",
      `${BASE_URL}/api/user/${id}`,
      null,
      headers
    );
  },
  updateUser: async (id, data, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "PUT",
      `${BASE_URL}/api/updateUser/${id}`,
      data,
      headers
    );
  },
  getUserGames: async (id) => {
    return await apiConnector("GET", `${BASE_URL}/api/userGames/${id}`);
  },
  getUserStats: async (id) => {
    return await apiConnector("GET", `${BASE_URL}/api/userStats/${id}`);
  },
  submitFeedback: async (playerId, text) => {
    return await apiConnector("POST", `${BASE_URL}/api/feedback/${playerId}`, {
      text,
    });
  },
  reportUser: async (reportedBy, reportedTo, reportedReason, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "POST",
      `${BASE_URL}/api/report`,
      { reportedBy, reportedTo, reportedReason },
      headers
    );
  },
  requestUnban: async (playerId, text) => {
    return await apiConnector(
      "POST",
      `${BASE_URL}/api/request-unban/${playerId}`,
      { text }
    );
  },
  getAllCheaters: async () => {
    return await apiConnector("GET", `${BASE_URL}/api/all-cheaters`);
  },
};

// ==================== GAME ENDPOINTS ====================
export const gameAPI = {
  getGameById: async (id) => {
    return await apiConnector("GET", `${BASE_URL}/api/game/${id}`);
  },
  getTopPlayers: async () => {
    return await apiConnector("GET", `${BASE_URL}/api/topPlayers`);
  },
  getCurrentFenAndPgn: async (roomId) => {
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/currentfensAndpng/${roomId}`
    );
  },
  checkWaitingQueue: async () => {
    return await apiConnector("GET", `${BASE_URL}/checkWaitingQueue`);
  },
  getRoomMessages: async (roomName) => {
    return await apiConnector("POST", `${BASE_URL}/RoomMessages`, { roomName });
  },
};

// ==================== PUZZLE ENDPOINTS ====================
export const puzzleAPI = {
  getDailyPuzzle: async () => {
    return await apiConnector("GET", `${BASE_URL}/api/dailyPuzzle`);
  },
  analyzePosition: async (fen) => {
    return await apiConnector("POST", `${BASE_URL}/api/analyze`, { fen });
  },
  getFideDetails: async (playerId) => {
    return await apiConnector("POST", `${BASE_URL}/api/fide-details`, {
      playerId,
    });
  },
  getOpenings: async () => {
    return await apiConnector("GET", `${BASE_URL}/api/openings`);
  },
  getTop10Players: async (mode = "blitz") => {
    return await apiConnector("POST", `${BASE_URL}/api/top-10`, { mode });
  },
};

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  login: async (email, password) => {
    return await apiConnector("POST", `${BASE_URL}/api/admin/login`, {
      email,
      password,
    });
  },
  signup: async (adminname, password, email, passkey) => {
    return await apiConnector("POST", `${BASE_URL}/api/admin/signup`, {
      adminname,
      password,
      email,
      passkey,
    });
  },
  banPlayer: async (playerId, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/ban/${playerId}`,
      null,
      headers
    );
  },
  unbanPlayer: async (playerId, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/unban/${playerId}`,
      null,
      headers
    );
  },
  getAllReportedPlayers: async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/allReportedPlayers`,
      null,
      headers
    );
  },
  getPlayerReports: async (playerId, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/reports/${playerId}`,
      null,
      headers
    );
  },
  getTotalUsers: async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/totalUsers`,
      null,
      headers
    );
  },
  getTotalGames: async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/totalGames`,
      null,
      headers
    );
  },
  getTotalReports: async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/totalReports`,
      null,
      headers
    );
  },
  getRecentGames: async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector(
      "GET",
      `${BASE_URL}/api/admin/recentGames`,
      null,
      headers
    );
  },
  getAllReports: async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector("GET", `${BASE_URL}/api/admin/reports`, null, headers);
  },
  resolveReport: async (reportId, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector("PUT", `${BASE_URL}/api/admin/reports/${reportId}/resolve`, null, headers);
  },
  deleteReport: async (reportId, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    return await apiConnector("DELETE", `${BASE_URL}/api/admin/reports/${reportId}`, null, headers);
  }
};

// Utility function to format the token for authentication headers
export const getAuthHeader = (token) => {
  return { Authorization: `Bearer ${token}` };
};
