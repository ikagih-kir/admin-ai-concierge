import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import apiClient from "@api/client";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    try {
      const res = await apiClient.post("/admin/auth/login", { email, password });
      const token = res.data?.access_token;
      if (!token) throw new Error("access_token が返ってきていません");

      localStorage.setItem("admin_token", token); // ★これが必須
      navigate("/products"); // どこでもOK
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e.message ?? "login failed");
    }
  };

  return (
    <Box p={3} maxWidth={420}>
      <Typography variant="h5" mb={2}>管理ログイン</Typography>

      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      <Button variant="contained" fullWidth onClick={handleLogin}>
        ログイン
      </Button>
    </Box>
  );
}
