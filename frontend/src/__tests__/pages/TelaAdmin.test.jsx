import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import TelaAdmin from "../../pages/TelaAdmin";

describe("TelaAdmin Page", () => {
  it("renderiza o painel admin e a aba de salas por padrão", () => {
    render(
      <MemoryRouter>
        <TelaAdmin />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Painel Admin (Salas)" })).toBeInTheDocument();
    expect(screen.getByText("Sala Auditório")).toBeInTheDocument();
  });

  it("permite alternar para as abas de Reservas e Usuários", () => {
    render(
      <MemoryRouter>
        <TelaAdmin />
      </MemoryRouter>
    );

    // Clica na aba de Reservas
    const abaReservas = screen.getByRole("tab", { name: /Reservas/i });
    fireEvent.click(abaReservas);
    expect(screen.getByRole("heading", { name: "Painel Admin (Reservas)" })).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();

    // Clica na aba de Usuários
    const abaUsuarios = screen.getByRole("tab", { name: /Usuários/i });
    fireEvent.click(abaUsuarios);
    expect(screen.getByRole("heading", { name: "Painel Admin (Usuários)" })).toBeInTheDocument();
    expect(screen.getByText("joao@email.com")).toBeInTheDocument();
  });

  it("abre o modal de cadastrar nova sala ao clicar em + Nova Sala", () => {
    render(
      <MemoryRouter>
        <TelaAdmin />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Nova Sala" }));
    expect(screen.getByRole("heading", { name: "Cadastrar Nova Sala" })).toBeInTheDocument();
  });
});
