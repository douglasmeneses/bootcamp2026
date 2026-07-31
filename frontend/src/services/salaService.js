import api from "./api.js";

export const salaService = {
  getAll: async (filtroParams) => {
    const response = await api.get("/salas", { params: filtroParams });
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((sala) => ({
      ...sala,
      preco: Number(sala.precoLocacao || sala.preco || 0),
    }));
  },
};
