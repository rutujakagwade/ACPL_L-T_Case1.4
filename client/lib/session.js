import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_DURATION = 20 * 24 * 60 * 60 * 1000; // 20 days

async function storeTokens(accessToken, refreshToken, role, name) {
  const now = Date.now();
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('accessToken_expiry', String(now + REFRESH_TOKEN_DURATION));
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  await SecureStore.setItemAsync('refreshToken_expiry', String(now + REFRESH_TOKEN_DURATION));
  if (role) await SecureStore.setItemAsync('userRole', role);
  if (name) await SecureStore.setItemAsync('userName', name);
}

async function getAccessToken() {
  return await SecureStore.getItemAsync('accessToken');
}

async function getRefreshToken() {
  return await SecureStore.getItemAsync('refreshToken');
}

async function getUserRole() {
  return await SecureStore.getItemAsync('userRole');
}

async function getUserName() {
  return await SecureStore.getItemAsync('userName');
}

async function isAccessTokenValid() {
  const expiry = await SecureStore.getItemAsync('accessToken_expiry');
  if (!expiry) return false;
  return Date.now() < parseInt(expiry, 10);
}

async function isRefreshTokenValid() {
  const expiry = await SecureStore.getItemAsync('refreshToken_expiry');
  if (!expiry) return false;
  return Date.now() < parseInt(expiry, 10);
}

async function isLoggedIn() {
  return await isRefreshTokenValid();
}

async function clearTokens() {
  const keys = ['accessToken','accessToken_expiry','refreshToken','refreshToken_expiry','userRole','userName'];
  await Promise.all(keys.map(k=>SecureStore.deleteItemAsync(k)));
}

async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://168.231.123.241:5000/api";
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    await clearTokens();
    throw new Error('Refresh failed: ' + res.status);
  }
  const data = await res.json();
  const newRefresh = data.refreshToken || refreshToken;
  await storeTokens(data.accessToken, newRefresh, data.role, data.name);
  return data.accessToken;
}

// Checkpoint functionality for navigation state
async function saveCheckpoint(route, params = {}) {
  const checkpoint = { route, params, timestamp: Date.now() };
  await SecureStore.setItemAsync('navigationCheckpoint', JSON.stringify(checkpoint));
}

async function getCheckpoint() {
  const checkpointStr = await SecureStore.getItemAsync('navigationCheckpoint');
  if (!checkpointStr) return null;
  try {
    return JSON.parse(checkpointStr);
  } catch {
    return null;
  }
}

async function clearCheckpoint() {
  await SecureStore.deleteItemAsync('navigationCheckpoint');
}

export {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  getUserRole,
  getUserName,
  isAccessTokenValid,
  isRefreshTokenValid,
  isLoggedIn,
  clearTokens,
  refreshAccessToken,
  saveCheckpoint,
  getCheckpoint,
  clearCheckpoint,
};