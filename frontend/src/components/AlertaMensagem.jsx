import { Alert } from "@mui/material";

// Componente de alerta dismissable reutilizável
// Reutilizado em: TelaSalas, TelaMinhasReservas, TelaAdminSalas, TelaPerfil
export default function AlertaMensagem({ mensagem, onFechar, severity = "success" }) {
  if (!mensagem) return null;

  return (
    <Alert severity={severity} sx={{ mb: 3, borderRadius: 2 }} onClose={onFechar}>
      {mensagem}
    </Alert>
  );
}
