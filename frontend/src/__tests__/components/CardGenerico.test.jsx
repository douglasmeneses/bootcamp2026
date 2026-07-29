import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CardGenerico from "../../components/CardGenerico";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

describe("CardGenerico Component", () => {
  it("renderiza o título, descrição, chips e botão com ícone", () => {
    const handleAcao = vi.fn();
    render(
      <CardGenerico
        titulo="Sala de Reuniões A"
        descricao="Equipada com TV 55 polegadas"
        chips={<span>Tag Teste</span>}
        textoBotao="Reservar"
        iconeBotao={<MeetingRoomIcon data-testid="icon" />}
        onAcao={handleAcao}
      />
    );

    expect(screen.getByText("Sala de Reuniões A")).toBeInTheDocument();
    expect(screen.getByText("Equipada com TV 55 polegadas")).toBeInTheDocument();
    expect(screen.getByText("Tag Teste")).toBeInTheDocument();

    const botao = screen.getByRole("button", { name: /Reservar/i });
    expect(botao).toBeInTheDocument();
    fireEvent.click(botao);
    expect(handleAcao).toHaveBeenCalledTimes(1);
  });
});
