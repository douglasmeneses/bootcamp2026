import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TelaSalas from "../../pages/TelaSalas";
import { salaService } from "../../services/salaService";
import { salasDisponiveis } from "../../data/mockData";

describe("TelaSalas Page", () => {
  beforeEach(() => {
    vi.spyOn(salaService, "getAll").mockResolvedValue(salasDisponiveis);
  });

  it("renderiza o título, os filtros e a lista de salas", () => {
    render(
      <MemoryRouter>
        <TelaSalas onNavegar={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Salas Disponíveis" })).toBeInTheDocument();
    expect(screen.getByText("Sala Auditório")).toBeInTheDocument();
    expect(screen.getByText("Sala Reuniões A")).toBeInTheDocument();
  });

  it("abre o modal de confirmação ao clicar em Reservar Sala", () => {
    render(
      <MemoryRouter>
        <TelaSalas onNavegar={vi.fn()} />
      </MemoryRouter>
    );
    const botoesReservar = screen.getAllByRole("button", { name: /Reservar Sala/i });
    fireEvent.click(botoesReservar[0]);

    expect(screen.getByRole("heading", { name: "Confirmar Reserva" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar Reserva" })).toBeInTheDocument();
  });
});
