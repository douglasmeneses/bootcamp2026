import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

// Painel de filtros de disponibilidade (usa classe .filter-panel)
export default function FiltroDisponibilidade({ dia, onDiaChange, turno, onTurnoChange, onFiltrar }) {
  return (
    <Paper elevation={2} className="filter-panel">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <FilterListIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Filtrar Disponibilidade:
        </Typography>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Dia"
            type="date"
            value={dia}
            onChange={(e) => onDiaChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>') !important`,
                backgroundRepeat: "no-repeat !important",
                backgroundPosition: "center !important",
                backgroundSize: "20px 20px !important",
                filter: "none !important",
                cursor: "pointer !important",
                opacity: "0.9 !important",
                "&:hover": {
                  opacity: "1 !important",
                  transform: "scale(1.1)",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            select
            label="Turno"
            value={turno}
            onChange={(e) => onTurnoChange(e.target.value)}
          >
            <MenuItem value="Manhã">Manhã (08:00 - 12:00)</MenuItem>
            <MenuItem value="Tarde">Tarde (13:00 - 17:00)</MenuItem>
            <MenuItem value="Noite">Noite (18:00 - 22:00)</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button fullWidth variant="contained" size="large" sx={{ py: 1.8 }} onClick={onFiltrar}>
            Filtrar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
