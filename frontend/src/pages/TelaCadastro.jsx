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
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import AlertaMensagem from "../components/AlertaMensagem";
import { usuarioService } from "../services/usuarioService";

// Tela 2: Cadastro de Usuário
export default function TelaCadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.cpf || !form.senha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem!");
      return;
    }

    setErro("");

    try {
      const novoUsuario = {
        nome: form.nome,
        email: form.email,
        cpf: form.cpf,
        telefone: form.telefone,
        senha: form.senha,
      };
      await usuarioService.cadastrar(novoUsuario);
      setMensagemSucesso(
        "Cadastro realizado com sucesso! Redirecionando para login... 🎉",
      );
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setErro(err.message || "Erro ao realizar cadastro");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "#151c2c",
          }}
        >
          <Box className="form-auth-icon">
            <PersonAddOutlinedIcon fontSize="large" />
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Preencha seus dados abaixo para se cadastrar no Coworking App
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
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label="Nome Completo"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                required
                label="E-mail"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                required
                label="CPF"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Telefone / WhatsApp"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                required
                label="Senha"
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                required
                label="Confirmar Senha"
                name="confirmarSenha"
                type="password"
                value={form.confirmarSenha}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5, mt: 1, fontWeight: "bold" }}
              >
                Cadastrar
              </Button>
            </Stack>
          </Box>

          <Box mt={3}>
            <Typography variant="body2" color="text.secondary">
              Já possui conta?{" "}
              <Link
                component="button"
                type="button"
                variant="body2"
                fontWeight="bold"
                underline="hover"
                onClick={() => navigate("/login")}
              >
                Fazer Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
