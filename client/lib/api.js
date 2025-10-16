// frontend/lib/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
// Use Docker service name for API base when both backend and client are in Docker
// Dynamically switch API URL depending on environment
// - Use LAN IP when running on Expo Go (phone)
// - Use backend service name when running inside Docker


// const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://168.231.123.241:5000/api";
const API_BASE = "http://192.168.1.10:5000/api";




// async function authFetch(endpoint, method = "GET", body = null, token) {
//   const storedToken = token || (await AsyncStorage.getItem("userToken"));
//   const headers = { "Content-Type": "application/json" };
//   if (storedToken) headers.Authorization = `Bearer ${storedToken}`;

//   const res = await fetch(`${API_BASE}${endpoint}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   return res.json();
// }
async function authFetch(endpoint, method = "GET", body = null, token) {
  const storedToken =
      token
      || (await AsyncStorage.getItem("userToken"))
      || (await AsyncStorage.getItem("adminToken"));

  const headers = { "Content-Type": "application/json" };
  if (storedToken) headers.Authorization = `Bearer ${storedToken}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}


// lib/api.js
export async function request(endpoint, method = "GET", body = null, token, isFormData = false) {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData) headers["Content-Type"] = "application/json";

    const url = `${API_BASE}${endpoint}`;
    console.log(`Making request to: ${url}`);
    console.log('Request headers:', headers);
    if (body) console.log('Request body:', body);

    const res = await fetch(url, {
      method,
      headers,
      body: body && !isFormData ? JSON.stringify(body) : body,
    }).catch(error => {
      console.error('Fetch error details:', {
        name: error.name,
        message: error.message,
        cause: error.cause,
        code: error.code
      });
      throw error;
    });

    const responseText = await res.text();
    console.log('Response status:', res.status);
    console.log('Response text:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (_) {
      responseData = responseText;
    }

    if (!res.ok) {
      console.error(`API Error: ${res.status} - ${responseText}`);
      throw new Error(
        responseData?.message || responseText || `HTTP error! status: ${res.status}`
      );
    }
    
    return responseData;
  } catch (err) {
    console.error('Full error details:', {
      name: err.name,
      message: err.message,
      cause: err.cause,
      stack: err.stack
    });
    throw err;
  }
}

export async function updateAdminProfile(body, token) {
  const res = await fetch(`${API_BASE}/admin/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

// =======================
// Auth (all users)
// =======================
export async function register(data) {
  return request("/auth/register", "POST", data);
}

export async function login(email, password) {
  const res = await request("/auth/login", "POST", { email, password });
  await AsyncStorage.setItem("token", res.token);
  return res;
}

// =======================
// SuperAdmin
// =======================
export async function superadminCreate(data) {
  return request("/superadmin/create", "POST", data);
}

export async function superadminLogin(email, password) {
  const res = await request("/superadmin/login", "POST", { email, password });
  await AsyncStorage.setItem("superadminToken", res.token);
  return res;
}

export async function superadminInviteAdmin(data, token) {
  return request("/superadmin/invite-admin", "POST", data, token);
}

export async function getUserProfile(token) {
  return request("/auth/me", "GET", null, token);
}

export async function updateUserProfile(data, token) {
  return request("/auth/me", "PUT", data, token);
}

// =======================
// Admin
// =======================
export async function getAdminProfile(token) {
  return request("/admin/profile", "GET", null, token);
}

export async function addMember(data, token) {
  return request("/admin/members/add", "POST", data, token);
}

export async function getMembers(token) {
  return request("/admin/members", "GET", null, token);
}

export async function getMemberProfile(memberId, token) {
  return request(`/admin/members/${memberId}`, "GET", null, token);
}

// =======================
// Balance
// =======================
export async function addBalance(memberId, amount, token) {
  return request(`/balance/${memberId}`, "POST", { amount }, token);
}

export async function getBalance(memberId, token) {
  return request(`/balance/${memberId}`, "GET", null, token);
}

// =======================
// Expenses
// =======================
export async function addExpense(formData, token) {
  return request("/expenses", "POST", formData, token, true);
}

// Get logged-in user's expenses
export async function getMyExpenses(token, status) {
  const query = status ? `?status=${status}` : "";
  return request(`/expenses/me${query}`, "GET", null, token);
}

// Get all expenses (filter by status)
export async function getAllExpenses(token, status) {
  try {
    const query = status ? `?status=${status}` : "";
    const res = await fetch(`${API_BASE}/expenses${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch expenses");
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function updateExpenseStatus(expenseId, status, token) {
  return request(`/expenses/${expenseId}/status`, "PATCH", { status }, token);
}

export async function bulkUpdateExpenses(ids, status, token) {
  return request("/expenses/bulk/status", "PATCH", { ids, status }, token);
}

// ✅ Journeys API (matches backend)
export const createJourney = async (data) => {
  const token = await AsyncStorage.getItem("userToken");
  return authFetch("/journeys", "POST", data, token);
};

export const getJourneys = async () => {
  const token = await AsyncStorage.getItem("userToken");
  return authFetch("/journeys", "GET", null, token);
};

export const getJourneyById = async (id) => {
  const token = await AsyncStorage.getItem("userToken");
  return authFetch(`/journeys/${id}`, "GET", null, token);
};

// ✅ IMPORTANT: use PUT instead of PATCH (backend uses PUT)
export const updateJourney = async (id, data) => {
  const token = await AsyncStorage.getItem("userToken");
  return authFetch(`/journeys/${id}`, "PUT", data, token);
};

// (Optional, if not implemented in backend yet)
export const deleteJourney = async (id) => {
  const token = await AsyncStorage.getItem("userToken");
  return authFetch(`/journeys/${id}`, "DELETE", null, token);
};



//userprofile

// export async function getUserProfile(token) {
//   return request("/user/profile", "GET", null, token);
// }

export async function getAdminExpensesTotal(token) {
  try {
    return request("/expenses/admin-total", "GET", null, token);
  } catch (err) {
    console.error("Error fetching admin total expenses:", err);
    throw err;
  }
}