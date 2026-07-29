import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Componente Genérico de Tabela de Dados (usa classes .table-paper, .table-head-row, .table-head-cell)
export default function TabelaGenerica({ colunas = [], dados = [], idProp = "id" }) {
  return (
    <TableContainer component={Paper} elevation={3} className="table-paper">
      <Table>
        <TableHead className="table-head-row">
          <TableRow>
            {colunas.map((col, index) => (
              <TableCell
                key={col.chave || col.titulo || index}
                align={col.align || "left"}
                className="table-head-cell"
                sx={col.sx}
              >
                {col.titulo}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dados.map((row) => (
            <TableRow key={row[idProp]} hover className="table-body-row">
              {colunas.map((col, index) => (
                <TableCell
                  key={col.chave || col.titulo || index}
                  align={col.align || "left"}
                  className="table-body-cell"
                  sx={col.cellSx}
                >
                  {col.render ? col.render(row) : row[col.chave]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
