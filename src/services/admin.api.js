import api from "./api";

export const CreateVerifier = async (payload) => {
  const res = await api.post("/create/verifier", payload);
  return res.data;
};

export const ListUser = async () => {
  const res = await api.get("/list/user");
  return res.data;
};

export const ubahRoleUser = async (id) => {
  const res = await api.put(`/ubah-role/${id}`);
  return res.data;
};

export const detailProfile = async () => {
  const res = await api.get(`/detail-profile`);
  return res.data;
};

export const ubahPassword = async (payload) => {
  const res = await api.put("/ubah-password", payload);
  return res.data;
};

export const dataDashboard = async () => {
  const res = await api.get(`/data-dashboard`);
  return res.data;
};
