# 🚀 INSTRUÇÕES DE DEPLOYMENT - SISTEMA SST

## 📋 **PASSO A PASSO PARA SUBIR NA VPS**

### **1. Conectar na VPS**
```bash
ssh root@145.223.29.139
```

### **2. Preparar ambiente**
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y docker.io docker-compose git curl wget nginx

# Iniciar Docker
systemctl start docker
systemctl enable docker
```

### **3. Clonar repositório**
```bash
cd /root
rm -rf sst
git clone https://github.com/vitorduarteebb/sst.git
cd sst
```

### **4. Gerar certificado SSL**
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=BR/ST=SP/L=Sao Paulo/O=SST/OU=IT/CN=145.223.29.139"
```

### **5. Executar deployment**
```bash
chmod +x deploy.sh
./deploy.sh
```

### **6. Verificar status**
```bash
docker-compose ps
```

## 🌐 **URLs de Acesso**

- **Frontend**: https://145.223.29.139
- **Backend API**: https://145.223.29.139/api/v1
- **Swagger**: https://145.223.29.139/api

## 🔑 **Credenciais Padrão**

- **Email**: admin@sst.com
- **Senha**: admin123

## 📞 **Comandos Úteis**

```bash
# Ver logs dos containers
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Reiniciar serviços
docker-compose restart

# Ver status dos containers
docker-compose ps

# Acessar container backend
docker exec -it sst_backend sh

# Acessar container frontend
docker exec -it sst_frontend sh
```

## 🔧 **Troubleshooting**

### **Se o frontend não carregar:**
```bash
docker-compose logs frontend
```

### **Se o backend não responder:**
```bash
docker-compose logs backend
```

### **Se o banco não conectar:**
```bash
docker-compose logs postgres
```

## 📊 **Monitoramento**

```bash
# Ver uso de recursos
docker stats

# Ver logs em tempo real
docker-compose logs -f --tail=100
```

---

**✅ Sistema SST pronto para uso em produção!**
