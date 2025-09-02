Write-Host "=== Teste de Autenticacao JWT ===" -ForegroundColor Green

# Passo 1: Verificar se o servidor está rodando
Write-Host "`nPasso 1: Verificando servidor..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/health" -Method GET
    Write-Host "✅ Servidor respondendo: $($healthResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor não está respondendo: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Passo 2: Fazer login
Write-Host "`nPasso 2: Fazendo login..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@sst.com"
    password = "password"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body ($loginData | ConvertTo-Json)
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.access_token.Substring(0, 20))..." -ForegroundColor Cyan
    
    $token = $loginResponse.access_token
} catch {
    Write-Host "❌ Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Passo 3: Testar endpoint protegido
Write-Host "`nPasso 3: Testando endpoint protegido..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" -Method GET -Headers $headers
    Write-Host "✅ Endpoint protegido funcionando!" -ForegroundColor Green
    Write-Host "Usuário: $($profileResponse.nome) - Role: $($profileResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erro no endpoint protegido: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host "`n=== Teste Concluido ===" -ForegroundColor Green
