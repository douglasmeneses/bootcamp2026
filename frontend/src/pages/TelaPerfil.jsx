import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
} from "@mui/material";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import AlertaMensagem from "../components/AlertaMensagem";
import ModalConfirmacao from "../components/ModalConfirmacao";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import { usuarioLogado } from "../data/mockData";

// Tela 5: Perfil do Usuário
export default function TelaPerfil() {
  const [usuario, setUsuario] = useState(usuarioLogado);

  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalRemoverAberto, setModalRemoverAberto] = useState(false);
  const [formEdicao, setFormEdicao] = useState({ nome: "", telefone: "" });
  const [mensagemAlert, setMensagemAlert] = useState("");

  const handleAbrirEditar = () => {
    setFormEdicao({ nome: usuario.nome, telefone: usuario.telefone });
    setModalEditarAberto(true);
  };

  const handleSalvarEdicao = () => {
    setUsuario({
      ...usuario,
      nome: formEdicao.nome,
      telefone: formEdicao.telefone,
    });
    setModalEditarAberto(false);
    setMensagemAlert("Dados cadastrais atualizados com sucesso! 🎉");
  };

  const handleConfirmarRemocao = () => {
    setModalRemoverAberto(false);
    setMensagemAlert("Conta removida com sucesso!");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 6 }}>
      <Navbar usuario={usuario} abaAtiva="perfil" />

      <Container maxWidth="md">
        <PageHeader
          titulo="Meu Perfil"
          subtitulo="Visualize e atualize suas informações pessoais de cadastro."
        />

        <AlertaMensagem
          mensagem={mensagemAlert}
          onFechar={() => setMensagemAlert("")}
        />

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#151c2c", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                fontSize: "1.75rem",
                fontWeight: "bold",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              }}
            >
              JS
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {usuario.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {usuario.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2.5, borderColor: "rgba(255, 255, 255, 0.08)" }} />

          <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary">
            Dados Pessoais
          </Typography>

          <Stack spacing={2} mb={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PersonIcon color="action" />
              <Typography variant="body1">
                <strong>Nome:</strong> {usuario.nome}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EmailIcon color="action" />
              <Typography variant="body1">
                <strong>E-mail:</strong> {usuario.email}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <BadgeIcon color="action" />
              <Typography variant="body1">
                <strong>CPF:</strong> {usuario.cpf}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PhoneIcon color="action" />
              <Typography variant="body1">
                <strong>Telefone:</strong> {usuario.telefone}
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleAbrirEditar}
              fullWidth
              sx={{ py: 1.2 }}
            >
              Editar Perfil
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => setModalRemoverAberto(true)}
              fullWidth
              sx={{ py: 1.2 }}
            >
              Remover Conta
            </Button>
          </Stack>
        </Paper>
      </Container>

      <Dialog open={modalEditarAberto} onClose={() => setModalEditarAberto(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight="bold">Editar Dados</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nome"
              value={formEdicao.nome}
              onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })}
            />
            <TextField
              fullWidth
              label="Telefone"
              value={formEdicao.telefone}
              onChange={(e) => setFormEdicao({ ...formEdicao, telefone: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalEditarAberto(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSalvarEdicao} variant="contained">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      <ModalConfirmacao
        aberto={modalRemoverAberto}
        titulo="Remover Conta"
        mensagem="Tem certeza que deseja remover a sua conta? Esta ação é irreversível e apagará seus dados do sistema."
        corBotao="error"
        textoBotaoConfirmar="Sim, Remover"
        textoBotaoCancelar="Voltar"
        onConfirmar={handleConfirmarRemocao}
        onFechar={() => setModalRemoverAberto(false)}
      />
    </Box>
  );
}
