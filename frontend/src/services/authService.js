import api from "./api.js";

export const authService = {
  cadastrar: async (dadosUsuario) => {
    const response = await api.post("/usuarios", dadosUsuario);
    return response.data;
  },

  login: async (email, senha) => {
    const response = await api.post("/auth/login", { email, senha });
    return response.data.usuario || response.data;
  },
};
