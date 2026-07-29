import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TabelaGenerica from "../../components/TabelaGenerica";

describe("TabelaGenerica Component", () => {
  const colunasMock = [
    { chave: "nome", titulo: "Nome" },
    { chave: "capacidade", titulo: "Capacidade", render: (r) => `${r.capacidade} pessoas` },
    {
      chave: "acoes",
      titulo: "Ações",
      render: (r) => <button onClick={() => onAction(r)}>Ação</button>,
    },
  ];
  const onAction = vi.fn();

  const dadosMock = [
    { id: 1, nome: "Sala A", capacidade: 10 },
    { id: 2, nome: "Sala B", capacidade: 20 },
  ];

  it("renderiza cabeçalhos das colunas corretamente", () => {
    render(<TabelaGenerica colunas={colunasMock} dados={dadosMock} />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Capacidade")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("renderiza os dados das linhas e aplica renderizadores customizados", () => {
    render(<TabelaGenerica colunas={colunasMock} dados={dadosMock} />);
    expect(screen.getByText("Sala A")).toBeInTheDocument();
    expect(screen.getByText("10 pessoas")).toBeInTheDocument();
    expect(screen.getByText("Sala B")).toBeInTheDocument();
    expect(screen.getByText("20 pessoas")).toBeInTheDocument();
  });
});
