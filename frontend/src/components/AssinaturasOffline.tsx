import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Sync as SyncIcon,
  CloudOff as CloudOffIcon,
  CloudDone as CloudDoneIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface Assinatura {
  id: string;
  servidorId?: string;
  tipo: 'CHECKLIST' | 'ORDEM_SERVICO' | 'TREINAMENTO' | 'INSPECAO';
  documentoId: string;
  responsavelNome: string;
  responsavelCpf: string;
  responsavelCargo: string;
  dadosAssinatura: string;
  observacoes?: string;
  dataAssinatura: string;
  latitude?: string;
  longitude?: string;
  empresaId: string;
  unidadeId: string;
  status: 'PENDENTE' | 'ENVIADO' | 'CONFIRMADO' | 'ERRO';
  tentativasSincronizacao: number;
  ultimaTentativa?: string;
  erroSincronizacao?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  pendentes: number;
  confirmadas: number;
  comErro: number;
  taxaSucesso: string;
}

const AssinaturasOffline: React.FC = () => {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const [novaAssinatura, setNovaAssinatura] = useState({
    tipo: 'CHECKLIST' as const,
    documentoId: '',
    responsavelNome: '',
    responsavelCpf: '',
    responsavelCargo: '',
    observacoes: '',
    latitude: '',
    longitude: '',
  });

  const API_BASE = 'http://localhost:3001/api/v1';

  useEffect(() => {
    carregarAssinaturas();
    carregarStats();
  }, []);

  const carregarAssinaturas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/assinaturas`);
      const data = await response.json();
      setAssinaturas(data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar assinaturas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/assinaturas/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const sincronizarAssinaturas = async () => {
    try {
      setSyncing(true);
      const response = await fetch(`${API_BASE}/assinaturas/sync`, {
        method: 'POST',
      });
      const data = await response.json();
      
      mostrarSnackbar(
        `${data.totalSincronizadas} assinaturas sincronizadas com sucesso!`,
        'success'
      );
      
      await carregarAssinaturas();
      await carregarStats();
    } catch (error) {
      mostrarSnackbar('Erro ao sincronizar assinaturas', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const forcarSincronizacao = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/assinaturas/${id}/sync`, {
        method: 'POST',
      });
      
      if (response.ok) {
        mostrarSnackbar('Assinatura sincronizada com sucesso!', 'success');
        await carregarAssinaturas();
        await carregarStats();
      } else {
        const error = await response.json();
        mostrarSnackbar(`Erro: ${error.message}`, 'error');
      }
    } catch (error) {
      mostrarSnackbar('Erro ao forçar sincronização', 'error');
    }
  };

  const criarAssinatura = async () => {
    try {
      const assinaturaData = {
        id: `local-${Date.now()}`,
        ...novaAssinatura,
        dadosAssinatura: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        dataAssinatura: new Date().toISOString(),
        empresaId: 'empresa-1',
        unidadeId: 'unidade-1',
        status: 'PENDENTE' as const,
      };

      const response = await fetch(`${API_BASE}/assinaturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assinaturaData),
      });

      if (response.ok) {
        mostrarSnackbar('Assinatura criada com sucesso!', 'success');
        setOpenDialog(false);
        setNovaAssinatura({
          tipo: 'CHECKLIST',
          documentoId: '',
          responsavelNome: '',
          responsavelCpf: '',
          responsavelCargo: '',
          observacoes: '',
          latitude: '',
          longitude: '',
        });
        await carregarAssinaturas();
        await carregarStats();
      } else {
        const error = await response.json();
        mostrarSnackbar(`Erro: ${error.message}`, 'error');
      }
    } catch (error) {
      mostrarSnackbar('Erro ao criar assinatura', 'error');
    }
  };

  const mostrarSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <CloudOffIcon color="warning" />;
      case 'CONFIRMADO':
        return <CloudDoneIcon color="success" />;
      case 'ERRO':
        return <ErrorIcon color="error" />;
      default:
        return <SyncIcon color="info" />;
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PENDENTE: { color: 'warning' as const, label: 'Pendente' },
      CONFIRMADO: { color: 'success' as const, label: 'Sincronizada' },
      ERRO: { color: 'error' as const, label: 'Erro' },
      ENVIADO: { color: 'info' as const, label: 'Enviado' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDENTE;

    return (
      <Chip
        icon={getStatusIcon(status)}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Assinaturas Offline
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={carregarAssinaturas}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<SyncIcon />}
            onClick={sincronizarAssinaturas}
            disabled={syncing || loading}
            sx={{ mr: 2 }}
          >
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nova Assinatura
          </Button>
        </Box>
      </Box>

      {/* Estatísticas */}
      {stats && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pendentes
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pendentes}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sincronizadas
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.confirmadas}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Taxa de Sucesso
              </Typography>
              <Typography variant="h4" color="info.main">
                {stats.taxaSucesso}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Lista de Assinaturas */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {assinaturas.map((assinatura) => (
            <Card key={assinatura.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {assinatura.tipo}
                  </Typography>
                  {getStatusChip(assinatura.status)}
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Documento:</strong> {assinatura.documentoId}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Responsável:</strong> {assinatura.responsavelNome}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Cargo:</strong> {assinatura.responsavelCargo}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Data:</strong> {formatarData(assinatura.dataAssinatura)}
                </Typography>
                
                {assinatura.observacoes && (
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Observações:</strong> {assinatura.observacoes}
                  </Typography>
                )}
                
                {assinatura.tentativasSincronizacao > 0 && (
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Tentativas:</strong> {assinatura.tentativasSincronizacao}
                  </Typography>
                )}
                  
                  {assinatura.erroSincronizacao && (
                    <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                      {assinatura.erroSincronizacao}
                    </Alert>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      ID: {assinatura.id}
                    </Typography>
                    
                    {assinatura.status === 'PENDENTE' && (
                      <Tooltip title="Forçar sincronização">
                        <IconButton
                          size="small"
                          onClick={() => forcarSincronizacao(assinatura.id)}
                          color="primary"
                        >
                          <SyncIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

      {/* Dialog Nova Assinatura */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nova Assinatura Offline</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={novaAssinatura.tipo}
                onChange={(e) => setNovaAssinatura({ ...novaAssinatura, tipo: e.target.value as any })}
                label="Tipo"
              >
                <MenuItem value="CHECKLIST">Checklist</MenuItem>
                <MenuItem value="ORDEM_SERVICO">Ordem de Serviço</MenuItem>
                <MenuItem value="TREINAMENTO">Treinamento</MenuItem>
                <MenuItem value="INSPECAO">Inspeção</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="ID do Documento"
              value={novaAssinatura.documentoId}
              onChange={(e) => setNovaAssinatura({ ...novaAssinatura, documentoId: e.target.value })}
            />
            <TextField
              fullWidth
              label="Nome do Responsável"
              value={novaAssinatura.responsavelNome}
              onChange={(e) => setNovaAssinatura({ ...novaAssinatura, responsavelNome: e.target.value })}
            />
            <TextField
              fullWidth
              label="CPF"
              value={novaAssinatura.responsavelCpf}
              onChange={(e) => setNovaAssinatura({ ...novaAssinatura, responsavelCpf: e.target.value })}
            />
            <TextField
              fullWidth
              label="Cargo"
              value={novaAssinatura.responsavelCargo}
              onChange={(e) => setNovaAssinatura({ ...novaAssinatura, responsavelCargo: e.target.value })}
            />
            <TextField
              fullWidth
              label="Latitude"
              value={novaAssinatura.latitude}
              onChange={(e) => setNovaAssinatura({ ...novaAssinatura, latitude: e.target.value })}
            />
            <TextField
              fullWidth
              label="Longitude"
              value={novaAssinatura.longitude}
              onChange={(e) => setNovaAssinatura({ ...novaAssinatura, longitude: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Observações"
              value={novaAssinatura.observacoes}
              onChange={(e) => setNovaAssinatura({ ...novaAssinatura, observacoes: e.target.value })}
              sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={criarAssinatura} variant="contained">
            Criar Assinatura
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssinaturasOffline;
