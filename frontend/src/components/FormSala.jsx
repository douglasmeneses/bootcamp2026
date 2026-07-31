import { TextField, Stack } from "@mui/material";

// Formulário reutilizável para criar e editar salas
// Utilizado em: TelaAdminSalas (modais de criação e edição)
export default function FormSala({ formSala, onFormChange }) {
  const handleChange = (campo) => (e) => {
    onFormChange({ ...formSala, [campo]: e.target.value });
  };

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Nome da Sala"
        placeholder="Ex: Sala Estúdio"
        value={formSala.nome}
        onChange={handleChange("nome")}
      />
      <TextField
        fullWidth
        label="Capacidade"
        type="number"
        placeholder="8"
        value={formSala.capacidade}
        onChange={handleChange("capacidade")}
      />
      <TextField
        fullWidth
        label="Preço R$/turno"
        type="number"
        placeholder="40"
        value={formSala.preco}
        onChange={handleChange("preco")}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Descrição"
        placeholder="Sala de gravação com isolamento"
        value={formSala.descricao}
        onChange={handleChange("descricao")}
      />
    </Stack>
  );
}
