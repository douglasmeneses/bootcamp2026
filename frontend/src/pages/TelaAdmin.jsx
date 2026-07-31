import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import Navbar from "../components/Navbar";
import AlertaMensagem from "../components/AlertaMensagem";
import TabelaGenerica from "../components/TabelaGenerica";
import FormSala from "../components/FormSala";
import ModalConfirmacao from "../components/ModalConfirmacao";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  salasAdmin,
  reservasAdmin,
  usuariosAdmin,
  usuarioAdminLogado,
} from "../data/mockData";

// Tela Unificada: Painel de Administração com 3 Abas (Salas, Reservas, Usuários)
export default function TelaAdmin({ abaInicial = 0 }) {
  const [tabIndex, setTabIndex] = useState(abaInicial);

  // Estados dos Dados
  const [salas, setSalas] = useState(salasAdmin);
  const [reservas, setReservas] = useState(reservasAdmin);
  const [usuarios, setUsuarios] = useState(usuariosAdmin);

  // Estados de Feedback
  const [mensagemAlert, setMensagemAlert] = useState("");

  // Estados dos Modais - Salas
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalExcluirSalaAberto, setModalExcluirSalaAberto] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [formSala, setFormSala] = useState({
    nome: "",
    capacidade: "",
    preco: "",
    descricao: "",
  });

  // Estados dos Modais - Reservas
  const [modalCancelarReservaAberto, setModalCancelarReservaAberto] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  // Estados dos Modais - Usuários
  const [modalExcluirUsuarioAberto, setModalExcluirUsuarioAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // --- Handlers: Salas ---
  const handleAbrirNovaSala = () => {
    setFormSala({ nome: "", capacidade: "", preco: "", descricao: "" });
    setModalNovaAberto(true);
  };

  const handleSalvarNovaSala = () => {
    const nova = {
      id: Date.now(),
      nome: formSala.nome || "Nova Sala",
      capacidade: Number(formSala.capacidade) || 10,
      preco: Number(formSala.preco) || 50,
      status: "Ativa",
      descricao: formSala.descricao || "",
    };
    setSalas([...salas, nova]);
    setModalNovaAberto(false);
    setMensagemAlert("Sala cadastrada com sucesso! 🎉");
  };

  const handleAbrirEditarSala = (sala) => {
    setSalaSelecionada(sala);
    setFormSala({
      nome: sala.nome,
      capacidade: sala.capacidade,
      preco: sala.preco,
      descricao: sala.descricao,
    });
    setModalEditarAberto(true);
  };

  const handleSalvarEdicaoSala = () => {
    setSalas(
      salas.map((s) =>
        s.id === salaSelecionada.id
          ? {
              ...s,
              nome: formSala.nome,
              capacidade: Number(formSala.capacidade),
              preco: Number(formSala.preco),
              descricao: formSala.descricao,
            }
          : s
      )
    );
    setModalEditarAberto(false);
    setMensagemAlert("Sala alterada com sucesso! 🎉");
  };

  const handleAbrirExcluirSala = (sala) => {
    setSalaSelecionada(sala);
    setModalExcluirSalaAberto(true);
  };

  const handleConfirmarExclusaoSala = () => {
    setSalas(salas.filter((s) => s.id !== salaSelecionada.id));
    setModalExcluirSalaAberto(false);
    setMensagemAlert("Sala removida com sucesso!");
  };

  // --- Handlers: Reservas ---
  const handleAbrirCancelarReserva = (reserva) => {
    setReservaSelecionada(reserva);
    setModalCancelarReservaAberto(true);
  };

  const handleConfirmarCancelamentoReserva = () => {
    setReservas(reservas.filter((r) => r.id !== reservaSelecionada.id));
    setModalCancelarReservaAberto(false);
    setMensagemAlert(
      `Reserva #${reservaSelecionada.id} de ${reservaSelecionada.usuario} cancelada com sucesso!`
    );
  };

  // --- Handlers: Usuários ---
  const handleAbrirExcluirUsuario = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalExcluirUsuarioAberto(true);
  };

  const handleConfirmarExclusaoUsuario = () => {
    setUsuarios(usuarios.filter((u) => u.id !== usuarioSelecionado.id));
    setModalExcluirUsuarioAberto(false);
    setMensagemAlert(
      `Usuário ${usuarioSelecionado.nome} removido com sucesso!`
    );
  };

  // --- Configuração das Colunas das Tabelas ---
  const colunasSalas = [
    { chave: "nome", titulo: "Nome da Sala", cellSx: { fontWeight: 600 } },
    {
      chave: "capacidade",
      titulo: "Capacidade",
      render: (row) => `${row.capacidade} pessoas`,
    },
    {
      chave: "preco",
      titulo: "Preço/Turno",
      render: (row) => `R$ ${row.preco}/turno`,
    },
    {
      chave: "status",
      titulo: "Status",
      render: (row) => (
        <Chip
          label={row.status}
          color={row.status === "Ativa" ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      chave: "acoes",
      titulo: "Ações",
      align: "right",
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleAbrirEditarSala(row)}
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleAbrirExcluirSala(row)}
          >
            Excluir
          </Button>
        </Box>
      ),
    },
  ];

  const colunasReservas = [
    { chave: "id", titulo: "ID", render: (row) => `#${row.id}` },
    { chave: "usuario", titulo: "Usuário", cellSx: { fontWeight: 600 } },
    { chave: "sala", titulo: "Sala" },
    { chave: "data", titulo: "Data" },
    { chave: "turno", titulo: "Turno" },
    {
      chave: "acoes",
      titulo: "Ações",
      align: "right",
      render: (row) => (
        <Button
          size="small"
          color="error"
          startIcon={<CancelIcon />}
          onClick={() => handleAbrirCancelarReserva(row)}
        >
          Cancelar
        </Button>
      ),
    },
  ];

  const colunasUsuarios = [
    { chave: "nome", titulo: "Nome", cellSx: { fontWeight: 600 } },
    { chave: "email", titulo: "E-mail" },
    { chave: "cpf", titulo: "CPF" },
    { chave: "telefone", titulo: "Telefone" },
    {
      chave: "acoes",
      titulo: "Ações",
      align: "right",
      render: (row) => (
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleAbrirExcluirUsuario(row)}
        >
          Excluir
        </Button>
      ),
    },
  ];

  const abaNome = tabIndex === 0 ? "admin" : tabIndex === 1 ? "adminReservas" : "adminUsuarios";
  const tituloPainel = tabIndex === 0 ? "Painel Admin (Salas)" : tabIndex === 1 ? "Painel Admin (Reservas)" : "Painel Admin (Usuários)";

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 6 }}>
      {/* Navbar com o perfil do Administrador */}
      <Navbar usuario={usuarioAdminLogado} abaAtiva={abaNome} />

      <Container maxWidth="xl">
        {/* Cabeçalho da Página */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box className="admin-badge-icon">
              <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {tituloPainel}
              </Typography>
              <Chip label="Modo: Administrador" color="primary" size="small" sx={{ fontWeight: 600, mt: 0.5 }} />
            </Box>
          </Box>

          {tabIndex === 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAbrirNovaSala}
              sx={{ py: 1.2, px: 2.5, fontWeight: 600 }}
            >
              + Nova Sala
            </Button>
          )}
        </Box>

        {/* Barra de Abas (Tabs) do Painel Admin */}
        <Paper
          elevation={1}
          sx={{
            backgroundColor: "#151c2c",
            borderRadius: 3,
            mb: 3,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(e, val) => setTabIndex(val)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                py: 2,
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#94a3b8",
                textTransform: "none",
                "&.Mui-selected": {
                  color: "#818cf8",
                },
              },
            }}
          >
            <Tab
              icon={<MeetingRoomIcon />}
              iconPosition="start"
              label={`Salas (${salas.length})`}
            />
            <Tab
              icon={<EventNoteIcon />}
              iconPosition="start"
              label={`Reservas (${reservas.length})`}
            />
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label={`Usuários (${usuarios.length})`}
            />
          </Tabs>
        </Paper>

        <AlertaMensagem
          mensagem={mensagemAlert}
          onFechar={() => setMensagemAlert("")}
        />

        {/* Conteúdo da Aba 0: Salas */}
        {tabIndex === 0 && <TabelaGenerica colunas={colunasSalas} dados={salas} />}

        {/* Conteúdo da Aba 1: Reservas */}
        {tabIndex === 1 && <TabelaGenerica colunas={colunasReservas} dados={reservas} />}

        {/* Conteúdo da Aba 2: Usuários */}
        {tabIndex === 2 && <TabelaGenerica colunas={colunasUsuarios} dados={usuarios} />}
      </Container>

      {/* --- MODAIS DE SALAS --- */}
      <Dialog open={modalNovaAberto} onClose={() => setModalNovaAberto(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight="bold">Cadastrar Nova Sala</DialogTitle>
        <DialogContent>
          <FormSala formSala={formSala} onFormChange={setFormSala} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalNovaAberto(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSalvarNovaSala} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalEditarAberto} onClose={() => setModalEditarAberto(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight="bold">Editar Sala</DialogTitle>
        <DialogContent>
          <FormSala formSala={formSala} onFormChange={setFormSala} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalEditarAberto(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSalvarEdicaoSala} variant="contained">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      <ModalConfirmacao
        aberto={modalExcluirSalaAberto}
        titulo="Excluir Sala"
        mensagem={
          <>
            Tem certeza que deseja remover a <strong>{salaSelecionada?.nome}</strong>?
          </>
        }
        corBotao="error"
        textoBotaoConfirmar="Sim, Excluir"
        textoBotaoCancelar="Voltar"
        onConfirmar={handleConfirmarExclusaoSala}
        onFechar={() => setModalExcluirSalaAberto(false)}
      />

      {/* --- MODAL DE RESERVAS --- */}
      <ModalConfirmacao
        aberto={modalCancelarReservaAberto}
        titulo="Cancelar Reserva"
        mensagem={
          <>
            Tem certeza que deseja cancelar a reserva <strong>#{reservaSelecionada?.id}</strong> de{" "}
            <strong>{reservaSelecionada?.usuario}</strong> na{" "}
            <strong>{reservaSelecionada?.sala}</strong> ({reservaSelecionada?.data} — {reservaSelecionada?.turno})?
          </>
        }
        corBotao="error"
        textoBotaoConfirmar="Sim, Cancelar"
        textoBotaoCancelar="Voltar"
        onConfirmar={handleConfirmarCancelamentoReserva}
        onFechar={() => setModalCancelarReservaAberto(false)}
      />

      {/* --- MODAL DE USUÁRIOS --- */}
      <ModalConfirmacao
        aberto={modalExcluirUsuarioAberto}
        titulo="Excluir Usuário"
        mensagem={
          <>
            Tem certeza que deseja remover o usuário <strong>{usuarioSelecionado?.nome}</strong> ({usuarioSelecionado?.email})?
            Esta ação é irreversível.
          </>
        }
        corBotao="error"
        textoBotaoConfirmar="Sim, Excluir"
        textoBotaoCancelar="Voltar"
        onConfirmar={handleConfirmarExclusaoUsuario}
        onFechar={() => setModalExcluirUsuarioAberto(false)}
      />
    </Box>
  );
}
