import { useState, useEffect } from "react";
import { Container, Chip, Alert } from "@mui/material";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import AlertaMensagem from "../components/AlertaMensagem";
import FiltroDisponibilidade from "../components/FiltroDisponibilidade";
import CardGenerico from "../components/CardGenerico";
import ModalConfirmacao from "../components/ModalConfirmacao";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { salasDisponiveis } from "../data/mockData";
import { salaService } from "../services/salaService";
import { reservaService } from "../services/reservaService";

// Tela 3: Salas Disponíveis (Filtro e Reserva)
export default function TelaSalas() {
  const [salas, setSalas] = useState(salasDisponiveis);
  const [loading, setLoading] = useState(false);

  const [dia, setDia] = useState("2026-07-17");
  const [turno, setTurno] = useState("Manhã");

  const [modalAberto, setModalAberto] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erro, setErro] = useState("");

  const rawUser = localStorage.getItem("usuario") || localStorage.getItem("usuarioLogado");
  const usuarioLogado = rawUser ? JSON.parse(rawUser) : { id: 1, nome: "Visitante", tipo: "cliente" };

  const handleAbrirModalReserva = (sala) => {
    setSalaSelecionada(sala);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setSalaSelecionada(null);
  };

  const handleFiltrar = async () => {
    setLoading(true);
    setErro("");
    try {
      const turnoNormalizado = turno.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const salasRetornadas = await salaService.getAll({
        disponivel: true,
        dia,
        turno: turnoNormalizado,
      });
      setSalas(salasRetornadas);
    } catch (err) {
      console.error("Erro ao carregar/filtrar salas:", err);
      setErro(err.message || "Não foi possível obter o filtro das salas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFiltrar();
  }, []);

  const handleConfirmarReserva = async () => {
    if (!usuarioLogado || !usuarioLogado.id) {
      alert("Você precisa estar logado para realizar uma reserva.");
      return;
    }

    try {
      const turnoNormalizado = turno.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      await reservaService.create({
        idUsuario: usuarioLogado.id,
        idSala: salaSelecionada.id,
        dia,
        turno: turnoNormalizado,
      });

      setMensagemSucesso(
        `Reserva da ${salaSelecionada?.nome} realizada com sucesso para ${dia} (${turno})! 🎉`
      );
      handleFiltrar();
    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      alert(err.message || "Erro ao realizar reserva. Tente novamente.");
    } finally {
      handleFecharModal();
    }
  };

  return (
    <div className="page-wrapper">
      {/* Navbar configurada para o tipo de usuário logado */}
      <Navbar usuario={usuarioLogado} abaAtiva="salas" />

      <Container maxWidth="xl">
        <PageHeader
          titulo="Salas Disponíveis"
          subtitulo="Selecione a data, escolha o turno desejado e faça a reserva da sua sala em poucos cliques."
        />

        <AlertaMensagem
          mensagem={mensagemSucesso}
          onFechar={() => setMensagemSucesso("")}
        />

        <FiltroDisponibilidade
          dia={dia}
          onDiaChange={setDia}
          turno={turno}
          onTurnoChange={setTurno}
          onFiltrar={handleFiltrar}
        />

        <div className="cards-grid">
          {salas.map((sala) => (
            <CardGenerico
              key={sala.id}
              titulo={sala.nome}
              descricao={sala.descricao}
              chips={
                <>
                  <Chip
                    icon={<PeopleIcon />}
                    label={`Capacidade: ${sala.capacidade} pessoas`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      color: "#f8fafc",
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    icon={<AttachMoneyIcon />}
                    label={`R$ ${sala.preco} / turno`}
                    size="small"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </>
              }
              textoBotao="Reservar Sala"
              iconeBotao={<MeetingRoomIcon />}
              variantBotao="contained"
              onAcao={() => handleAbrirModalReserva(sala)}
            />
          ))}
        </div>
      </Container>

      <ModalConfirmacao
        aberto={modalAberto}
        titulo="Confirmar Reserva"
        mensagem={
          <>
            Deseja confirmar a reserva da{" "}
            <strong>{salaSelecionada?.nome}</strong> para o dia{" "}
            <strong>{dia}</strong> no turno da <strong>{turno}</strong> pelo
            valor de <strong>R$ {salaSelecionada?.preco}/turno</strong>?
          </>
        }
        textoBotaoConfirmar="Confirmar Reserva"
        iconeBotao={<CheckCircleIcon />}
        onConfirmar={handleConfirmarReserva}
        onFechar={handleFecharModal}
      />
    </div>
  );
}
