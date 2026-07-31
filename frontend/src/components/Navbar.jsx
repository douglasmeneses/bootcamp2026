import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";

// Componente de Barra de Navegação Superior
// Ajusta automaticamente os links e opções exibidas de acordo com o tipo de usuário logado
// Props:
// - usuario: { nome: string, email: string, tipo: 'cliente' | 'admin' } (opcional)
// - abaAtiva?: string (para destacar a aba atual)
// - onNavegar?: (rota: string) => void (função de callback para navegação)
export default function Navbar({ usuario = null, abaAtiva = "", onNavegar = null }) {
  const navigate = useNavigate();
  const isAdmin = usuario?.tipo === "admin";
  const isCliente = usuario?.tipo === "cliente";
  const isVisitante = !usuario;

  const handleNavegar = (rota) => {
    if (onNavegar) {
      onNavegar(rota);
    } else {
      navigate(rota);
    }
  };

  return (
    <AppBar position="static" elevation={0} className="navbar-appbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo e Identificação do Sistema */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
            onClick={() => handleNavegar(isAdmin ? "/admin" : "/salas")}
          >
            <Box className="logo-badge">
              {isAdmin ? <AdminPanelSettingsIcon /> : <MeetingRoomIcon />}
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "white", lineHeight: 1.1, letterSpacing: 0.5 }}>
                  COWORKING APP
                </Typography>

                {/* Badge para diferenciar Administrador */}
                {isAdmin && (
                  <Chip
                    label="ADMIN"
                    color="primary"
                    size="small"
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                  />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {isAdmin ? "Painel de Administração" : "Espaços & Reservas"}
              </Typography>
            </Box>
          </Box>

          {/* Links da Navegação Condicionais por Tipo de Usuário */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            {/* Visão de CLIENTE */}
            {isCliente && (
              <>
                <Button
                  className={`nav-btn ${abaAtiva === "salas" ? "active" : ""}`}
                  startIcon={<MeetingRoomIcon />}
                  onClick={() => handleNavegar("/salas")}
                >
                  Salas Disponíveis
                </Button>

                <Button
                  className={`nav-btn ${abaAtiva === "reservas" ? "active" : ""}`}
                  startIcon={<EventNoteIcon />}
                  onClick={() => handleNavegar("/minhas-reservas")}
                >
                  Minhas Reservas
                </Button>
              </>
            )}

            {/* Visão de ADMINISTRADOR */}
            {isAdmin && (
              <>
                <Button
                  className={`nav-btn ${abaAtiva.startsWith("admin") ? "active" : ""}`}
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={() => handleNavegar("/admin")}
                >
                  Painel Admin
                </Button>
              </>
            )}

            {/* Visão de VISITANTE (Não Logado) */}
            {isVisitante && (
              <>
                <Button
                  className={`nav-btn ${abaAtiva === "salas" ? "active" : ""}`}
                  startIcon={<MeetingRoomIcon />}
                  onClick={() => handleNavegar("/salas")}
                >
                  Salas Disponíveis
                </Button>

                <Button
                  className="nav-btn"
                  startIcon={<LoginIcon />}
                  onClick={() => handleNavegar("/login")}
                >
                  Entrar / Cadastrar
                </Button>
              </>
            )}

            {/* Identificação do Usuário Logado no Canto (Clique para acessar o Perfil) */}
            {usuario && (
              <Tooltip title="Ver Meu Perfil" arrow>
                <Box
                  sx={{
                    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
                    pl: 2,
                    ml: 1,
                    py: 0.5,
                    px: 1.5,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    backgroundColor: abaAtiva === "perfil" ? "rgba(99, 102, 241, 0.2)" : "transparent",
                    border: abaAtiva === "perfil" ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                  onClick={() => handleNavegar("/perfil")}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.85rem",
                      bgcolor: isAdmin ? "#ec4899" : "#6366f1",
                      fontWeight: "bold",
                    }}
                  >
                    {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Typography variant="body2" fontWeight="600" sx={{ color: "white" }}>
                    {usuario.nome}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
