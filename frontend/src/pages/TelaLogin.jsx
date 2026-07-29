import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Stack,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AlertaMensagem from "../components/AlertaMensagem";

// Tela 1: Login de Usuário
export default function TelaLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }
    setErro("");
    setMensagemSucesso("Login realizado com sucesso! Redirecionando... 🎉");
    
    setTimeout(() => {
      if (email.toLowerCase().includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/salas");
      }
    }, 500);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", display: "flex", alignItems: "center", py: 4 }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center", backgroundColor: "#151c2c" }}>
          <Box className="form-auth-icon">
            <LockOutlinedIcon fontSize="large" />
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Acessar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Entre com suas credenciais para gerenciar suas reservas no Coworking App
          </Typography>

          <AlertaMensagem
            mensagem={mensagemSucesso}
            onFechar={() => setMensagemSucesso("")}
          />

          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                required
                label="E-mail"
                type="email"
                placeholder="cliente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                required
                label="Senha"
                type="password"
                placeholder="**********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5, mt: 1, fontWeight: "bold" }}
              >
                Entrar
              </Button>
            </Stack>
          </Box>

          <Box mt={3}>
            <Typography variant="body2" color="text.secondary">
              Ainda não possui conta?{" "}
              <Link
                component="button"
                type="button"
                variant="body2"
                fontWeight="bold"
                underline="hover"
                onClick={() => navigate("/cadastro")}
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
