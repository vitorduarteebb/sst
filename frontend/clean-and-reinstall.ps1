# Script para limpar e reinstalar o frontend
Write-Host "🧹 Limpando frontend..." -ForegroundColor Yellow

# Parar processos Node.js
Write-Host "🛑 Parando processos Node.js..." -ForegroundColor Blue
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Remover diretórios de build e cache
Write-Host "🗑️ Removendo diretórios de build..." -ForegroundColor Blue
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path ".npm") { Remove-Item -Recurse -Force ".npm" }

# Limpar cache do npm
Write-Host "🧹 Limpando cache do npm..." -ForegroundColor Blue
npm cache clean --force

# Reinstalar dependências
Write-Host "📦 Reinstalando dependências..." -ForegroundColor Green
npm install

# Testar build
Write-Host "🔨 Testando build..." -ForegroundColor Green
npm run build

Write-Host "✅ Limpeza e reinstalação concluídas!" -ForegroundColor Green
Write-Host "🚀 Agora você pode executar: npm run dev" -ForegroundColor Cyan
