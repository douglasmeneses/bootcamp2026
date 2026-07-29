import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FiltroDisponibilidade from "../../components/FiltroDisponibilidade";

describe("FiltroDisponibilidade Component", () => {
  it("renderiza os campos de dia e turno e disparacallbacks", () => {
    const handleDia = vi.fn();
    const handleTurno = vi.fn();
    const handleFiltrar = vi.fn();

    render(
      <FiltroDisponibilidade
        dia="2026-07-17"
        onDiaChange={handleDia}
        turno="Manhã"
        onTurnoChange={handleTurno}
        onFiltrar={handleFiltrar}
      />
    );

    expect(screen.getByLabelText("Dia")).toBeInTheDocument();
    expect(screen.getByText("Filtrar Disponibilidade:")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Filtrar"));
    expect(handleFiltrar).toHaveBeenCalledTimes(1);
  });
});
