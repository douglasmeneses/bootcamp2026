import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

// Componente genérico de modal de confirmação
// Reutilizado em: TelaSalas, TelaMinhasReservas, TelaAdminSalas, TelaPerfil
export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  corBotao = "primary",
  textoBotaoConfirmar = "Confirmar",
  textoBotaoCancelar = "Cancelar",
  iconeBotao = null,
  onConfirmar,
  onFechar,
}) {
  return (
    <Dialog
      open={aberto}
      onClose={onFechar}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle fontWeight="bold" color={corBotao === "error" ? "error" : "text.primary"}>
        {titulo}
      </DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{mensagem}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onFechar} color="inherit">
          {textoBotaoCancelar}
        </Button>
        <Button
          onClick={onConfirmar}
          variant="contained"
          color={corBotao}
          startIcon={iconeBotao}
        >
          {textoBotaoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
