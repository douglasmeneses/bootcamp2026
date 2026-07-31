import api from "./api.js";

export const usuarioService = {
  cadastrar: async (dadosUsuario) => {
    const response = await api.post("/usuarios", dadosUsuario);
    return response.data;
  },
};
