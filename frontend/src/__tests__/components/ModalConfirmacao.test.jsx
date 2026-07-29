import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ModalConfirmacao from "../../components/ModalConfirmacao";

describe("ModalConfirmacao Component", () => {
  it("não renderiza quando 'aberto' é false", () => {
    render(
      <ModalConfirmacao
        aberto={false}
        titulo="Título Teste"
        mensagem="Mensagem Teste"
        onConfirmar={vi.fn()}
        onFechar={vi.fn()}
      />
    );
    expect(screen.queryByText("Título Teste")).not.toBeInTheDocument();
  });

  it("renderiza título e mensagem quando 'aberto' é true", () => {
    render(
      <ModalConfirmacao
        aberto={true}
        titulo="Título Teste"
        mensagem="Mensagem Teste"
        onConfirmar={vi.fn()}
        onFechar={vi.fn()}
      />
    );
    expect(screen.getByText("Título Teste")).toBeInTheDocument();
    expect(screen.getByText("Mensagem Teste")).toBeInTheDocument();
  });

  it("chama onConfirmar e onFechar ao clicar nos botões respectivos", () => {
    const handleConfirmar = vi.fn();
    const handleFechar = vi.fn();

    render(
      <ModalConfirmacao
        aberto={true}
        titulo="Confirmar Operação"
        mensagem="Tem certeza?"
        textoBotaoConfirmar="Sim, Confirmar"
        textoBotaoCancelar="Cancelar"
        onConfirmar={handleConfirmar}
        onFechar={handleFechar}
      />
    );

    fireEvent.click(screen.getByText("Sim, Confirmar"));
    expect(handleConfirmar).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Cancelar"));
    expect(handleFechar).toHaveBeenCalledTimes(1);
  });
});
