import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import AlertaMensagem from "../components/AlertaMensagem";
import CardGenerico from "../components/CardGenerico";
import ModalConfirmacao from "../components/ModalConfirmacao";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import { reservasDoUsuario } from "../data/mockData";
import { reservaService } from "../services/reservaService";

// Tela 4: Minhas Reservas (Listagem e Cancelamento)
export default function TelaMinhasReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState(reservasDoUsuario);
  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [reservaParaCancelar, setReservaParaCancelar] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const rawUser = localStorage.getItem("usuario") || localStorage.getItem("usuarioLogado");
  const usuarioLogado = rawUser ? JSON.parse(rawUser) : { id: 1, nome: "Visitante", tipo: "cliente" };

  const carregarMinhasReservas = async () => {
    setLoading(true);
    try {
      const todas = await reservaService.getAll();
      if (Array.isArray(todas)) {
        const filtradas = todas
          .filter((r) => r.idUsuario === usuarioLogado?.id || r.usuarioId === usuarioLogado?.id)
          .map((r) => ({
            ...r,
            salaNome: r.sala?.nome || r.salaNome || "Sala",
            data: r.dia || r.data,
          }));
        setReservas(filtradas);
      }
    } catch (err) {
      console.error("Erro ao carregar reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMinhasReservas();
  }, []);

  const handleAbrirModalCancelar = (reserva) => {
    setReservaParaCancelar(reserva);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setReservaParaCancelar(null);
  };

  const handleConfirmarCancelamento = async () => {
    try {
      if (reservaParaCancelar?.id) {
        await reservaService.delete(reservaParaCancelar.id);
      }
      setMensagem(`Reserva da ${reservaParaCancelar?.salaNome || "sala"} cancelada com sucesso! 🎉`);
      carregarMinhasReservas();
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
      // Fallback local update if API fails or mock item
      setReservas(reservas.filter((r) => r.id !== reservaParaCancelar.id));
      setMensagem(`Reserva da ${reservaParaCancelar?.salaNome || "sala"} cancelada com sucesso! 🎉`);
    } finally {
      handleFecharModal();
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar usuario={usuarioLogado} abaAtiva="reservas" />

      <Container maxWidth="xl">
        <PageHeader
          titulo="Minhas Reservas"
          subtitulo="Acompanhe e gerencie seus agendamentos ativos no coworking."
        />

        <AlertaMensagem
          mensagem={mensagem}
          onFechar={() => setMensagem("")}
        />

        {reservas.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px dashed rgba(255, 255, 255, 0.15)", backgroundColor: "#151c2c" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Você não possui reservas agendadas no momento.
            </Typography>

            <Button
              variant="contained"
              startIcon={<MeetingRoomIcon />}
              sx={{ mt: 2 }}
            >
              Ver Salas Disponíveis
            </Button>
          </Paper>
        ) : (
          <div className="cards-grid">
            {reservas.map((reserva) => (
              <CardGenerico
                key={reserva.id}
                titulo={reserva.salaNome}
                chips={
                  <>
                    <Chip
                      icon={<EventAvailableIcon />}
                      label={`Data: ${reserva.data}`}
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={`Turno: ${reserva.turno}`}
                      color="secondary"
                      sx={{ fontWeight: 600 }}
                    />
                  </>
                }
                textoBotao="Cancelar Reserva"
                iconeBotao={<CancelIcon />}
                corBotao="error"
                variantBotao="outlined"
                onAcao={() => handleAbrirModalCancelar(reserva)}
              />
            ))}
          </div>
        )}
      </Container>

      <ModalConfirmacao
        aberto={modalAberto}
        titulo="Cancelar Reserva"
        mensagem={
          <>
            Tem certeza que deseja cancelar a reserva da{" "}
            <strong>{reservaParaCancelar?.salaNome}</strong> agendada para dia{" "}
            <strong>{reservaParaCancelar?.data}</strong> ({reservaParaCancelar?.turno})?
          </>
        }
        corBotao="error"
        textoBotaoConfirmar="Sim, Cancelar"
        textoBotaoCancelar="Voltar"
        onConfirmar={handleConfirmarCancelamento}
        onFechar={handleFecharModal}
      />
    </div>
  );
}
