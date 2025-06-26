import api from "./api";

export const ListUser = async () => {
  const res = await api.get("/verifier/list/user");
  return res.data;
};

export const verfikasiUser = async (id) => {
  const res = await api.get(`/verifier/user/${id}`);
  return res.data;
};

export const listIzin = async () => {
  const res = await api.get(`/verifier/list-izin`);
  return res.data;
};

export const detailIzin = async (id) => {
  const res = await api.get(`/user/izin-detail/${id}`);
  return res.data;
};

export const reject = async (id) => {
  const res = await api.put(`/verifier/permission/${id}/rejected`);
  return res.data;
};

export const revision = async (id) => {
  const res = await api.put(`/verifier/permission/${id}/revision`);
  return res.data;
};

export const cancelled = async (id) => {
  const res = await api.put(`/verifier/permission/${id}/cancelled`);
  return res.data;
};

export const approved = async (id) => {
  const res = await api.put(`/verifier/permission/${id}/approved`);
  return res.data;
};

export const balasChat = async (payload) => {
  const res = await api.post(`/user/izin/chat`, payload);
  return res.data;
};
