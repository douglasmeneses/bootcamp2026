import { Routes, Route, Navigate } from "react-router-dom";
import TelaLogin from "./pages/TelaLogin";
import TelaCadastro from "./pages/TelaCadastro";
import TelaSalas from "./pages/TelaSalas";
import TelaPerfil from "./pages/TelaPerfil";
import TelaMinhasReservas from "./pages/TelaMinhasReservas";
import TelaAdmin from "./pages/TelaAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<TelaLogin />} />
      <Route path="/cadastro" element={<TelaCadastro />} />
      <Route path="/salas" element={<TelaSalas />} />
      <Route path="/perfil" element={<TelaPerfil />} />
      <Route path="/minhas-reservas" element={<TelaMinhasReservas />} />
      <Route path="/admin" element={<TelaAdmin />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
