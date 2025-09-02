import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:3001/api/v1';

  const handleInputChange = (field: keyof LoginData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    setError(''); // Limpar erro quando usuário digita
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Usar o contexto de auth para fazer login
        await login(data.access_token, data.user);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                  Sistema SST
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Faça login para acessar o sistema
                </Typography>
              </Box>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      endAdornment: (
                        <Button
                          onClick={handleTogglePassword}
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Button>
                      ),
                    }}
                    disabled={loading}
                  />

                  {/* Error Message */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </Box>
              </form>

              {/* Demo Credentials */}
              <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Credenciais de Demonstração:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Admin:</strong> admin@sst.com / password
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Técnico:</strong> tecnico@sst.com / password
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Cliente:</strong> cliente@sst.com / password
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
