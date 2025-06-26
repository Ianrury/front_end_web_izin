import api from "./api";

export const createIzin = async (payload) => {
  const res = await api.post("/user/izin", payload);
  return res.data;
};

export const dataDashboard = async () => {
  const res = await api.get(`/user/data-dashboard`);
  return res.data;
};

export const listizin = async () => {
  const res = await api.get(`/user/list-izin`);
  return res.data;
};

export const detailIzin = async (id) => {
  const res = await api.get(`/user/izin-detail/${id}`);
  return res.data;
};

export const balasChat = async (payload) => {
  const res = await api.post(`/user/izin/chat`, payload);
  return res.data;
};

export const editIzin = async (payload) => {
  const res = await api.put(`/user/izin/edit`, payload);
  return res.data;
};

export const deteleIzin = async (id) => {
  const res = await api.delete(`/user/izin/${id}`);
  return res.data;
};

export const infoProfile = async () => {
  const res = await api.get(`/user/profil-info`);
  return res.data;
};

export const ubahPassword = async (payload) => {
  const res = await api.put("/ubah-password", payload);
  return res.data;
};
