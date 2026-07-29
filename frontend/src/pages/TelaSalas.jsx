import { useState } from "react";
import { Container, Chip } from "@mui/material";
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
import { salasDisponiveis, usuarioLogado } from "../data/mockData";

// Tela 3: Salas Disponíveis (Filtro e Reserva)
export default function TelaSalas() {
  const [salas] = useState(salasDisponiveis);

  const [dia, setDia] = useState("2026-07-17");
  const [turno, setTurno] = useState("Manhã");

  const [modalAberto, setModalAberto] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const handleAbrirModalReserva = (sala) => {
    setSalaSelecionada(sala);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setSalaSelecionada(null);
  };

  const handleConfirmarReserva = () => {
    setMensagemSucesso(
      `Reserva da ${salaSelecionada?.nome} realizada com sucesso para ${dia} (${turno})! 🎉`
    );
    handleFecharModal();
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
          onFiltrar={() => {}}
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
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.06)", color: "#f8fafc", fontWeight: 500 }}
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
            <strong>{dia}</strong> no turno da <strong>{turno}</strong> pelo valor de{" "}
            <strong>R$ {salaSelecionada?.preco}/turno</strong>?
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
