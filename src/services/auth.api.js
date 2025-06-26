import api from "./api";

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);
  const { token, user } = res.data;

  document.cookie = `x_site_session=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

  return { user }; 
};

export const register = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return res.data.user;
};

export const logout = async () => {
  await api.post("/auth/logout");
};
