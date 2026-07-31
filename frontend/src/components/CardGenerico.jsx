import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

// Componente Genérico de Card (usa classe .card-item)
export default function CardGenerico({
  titulo,
  descricao,
  chips,
  textoBotao,
  iconeBotao,
  corBotao = "primary",
  variantBotao = "contained",
  onAcao,
}) {
  return (
    <Card elevation={3} className="card-item">
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: descricao ? 1.5 : 2 }}>
          {titulo}
        </Typography>

        {descricao && (
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 3 }}>
            {descricao}
          </Typography>
        )}

        <Divider sx={{ mb: 2.5 }} />

        {chips && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {chips}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant={variantBotao}
          color={corBotao}
          startIcon={iconeBotao}
          onClick={onAcao}
          sx={{ py: 1.2 }}
        >
          {textoBotao}
        </Button>
      </CardActions>
    </Card>
  );
}
