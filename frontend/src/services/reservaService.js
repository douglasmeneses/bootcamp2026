import api from "./api.js";

export const reservaService = {
  getAll: async () => {
    const response = await api.get("/reservas");
    return response.data;
  },

  create: async ({ idUsuario, idSala, dia, turno }) => {
    const response = await api.post("/reservas", {
      idUsuario: Number(idUsuario),
      idSala: Number(idSala),
      dia,
      turno,
    });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/reservas/${id}`);
  },
};
