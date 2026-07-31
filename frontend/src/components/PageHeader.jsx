import { Typography, Box } from "@mui/material";

// Componente de cabeçalho padrão de página (título + subtítulo)
// Reutilizado em: TelaSalas, TelaMinhasReservas, TelaPerfil
export default function PageHeader({ titulo, subtitulo, children }) {
  return (
    <Box
      sx={{
        mb: 4,
        display: children ? "flex" : "block",
        justifyContent: children ? "space-between" : undefined,
        alignItems: children ? "center" : undefined,
        flexWrap: children ? "wrap" : undefined,
        gap: children ? 2 : undefined,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          {titulo}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {subtitulo}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}
