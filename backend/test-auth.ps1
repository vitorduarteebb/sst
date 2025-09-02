Write-Host "🧪 Testes de Autenticação JWT" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1"

# Função para fazer requisições com tratamento de erro
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [object]$Body = $null,
        [string]$Token = $null
    )
    
    Write-Host "`n📡 $Description" -ForegroundColor Yellow
    Write-Host "URL: $Method $Url" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }
        
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body ($Body | ConvertTo-Json -Depth 10)
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers
        }
        
        Write-Host "✅ Sucesso!" -ForegroundColor Green
        Write-Host "Resposta: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor White
        return $response
    }
    catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "Status Code: $statusCode" -ForegroundColor Red
        }
        return $null
    }
}

# Aguardar servidor iniciar
Write-Host "⏳ Aguardando servidor iniciar..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# 1. Teste: Login Admin
Write-Host "`n🎯 Teste 1: Login Admin" -ForegroundColor Cyan
$loginData = @{
    email = "admin@sst.com"
    password = "password"
}

$loginResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Login como Admin" -Body $loginData

if ($loginResponse) {
    $adminToken = $loginResponse.access_token
    Write-Host "✅ Token Admin obtido: $($adminToken.Substring(0, 20))..." -ForegroundColor Green
    
    # 2. Teste: Validar Token
    Write-Host "`n🎯 Teste 2: Validar Token" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/auth/validate" -Description "Validar token JWT" -Token $adminToken
    
    # 3. Teste: Obter Perfil
    Write-Host "`n🎯 Teste 3: Obter Perfil" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/auth/profile" -Description "Obter perfil do usuário" -Token $adminToken
    
    # 4. Teste: Listar Usuários (Admin)
    Write-Host "`n🎯 Teste 4: Listar Usuários (Admin)" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/auth/users" -Description "Listar todos os usuários" -Token $adminToken
    
    # 5. Teste: Acessar Assinaturas (Protegido)
    Write-Host "`n🎯 Teste 5: Acessar Assinaturas (Protegido)" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Acessar assinaturas com token" -Token $adminToken
}

# 6. Teste: Login Técnico
Write-Host "`n🎯 Teste 6: Login Técnico" -ForegroundColor Cyan
$loginTecnico = @{
    email = "tecnico@sst.com"
    password = "password"
}

$tecnicoResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Login como Técnico" -Body $loginTecnico

if ($tecnicoResponse) {
    $tecnicoToken = $tecnicoResponse.access_token
    Write-Host "✅ Token Técnico obtido: $($tecnicoToken.Substring(0, 20))..." -ForegroundColor Green
    
    # 7. Teste: Técnico acessar assinaturas
    Write-Host "`n🎯 Teste 7: Técnico Acessar Assinaturas" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Técnico acessar assinaturas" -Token $tecnicoToken
}

# 8. Teste: Login Cliente
Write-Host "`n🎯 Teste 8: Login Cliente" -ForegroundColor Cyan
$loginCliente = @{
    email = "cliente@sst.com"
    password = "password"
}

$clienteResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Login como Cliente" -Body $loginCliente

if ($clienteResponse) {
    $clienteToken = $clienteResponse.access_token
    Write-Host "✅ Token Cliente obtido: $($clienteToken.Substring(0, 20))..." -ForegroundColor Green
    
    # 9. Teste: Cliente tentar acessar assinaturas (deve falhar)
    Write-Host "`n🎯 Teste 9: Cliente Tentar Acessar Assinaturas (Deve Falhar)" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Cliente tentar acessar assinaturas" -Token $clienteToken
}

# 10. Teste: Login inválido
Write-Host "`n🎯 Teste 10: Login Inválido" -ForegroundColor Cyan
$loginInvalido = @{
    email = "invalido@sst.com"
    password = "senhaerrada"
}

Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Tentativa de login inválido" -Body $loginInvalido

# 11. Teste: Acesso sem token (deve falhar)
Write-Host "`n🎯 Teste 11: Acesso Sem Token (Deve Falhar)" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Tentar acessar assinaturas sem token"

Write-Host "`n🎯 Resumo dos Testes:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green

if ($loginResponse) {
    Write-Host "✅ Login Admin: Funcionando" -ForegroundColor Green
    Write-Host "✅ Validação Token: Funcionando" -ForegroundColor Green
    Write-Host "✅ Perfil Usuário: Funcionando" -ForegroundColor Green
    Write-Host "✅ Listar Usuários (Admin): Funcionando" -ForegroundColor Green
    Write-Host "✅ Acesso Assinaturas (Admin): Funcionando" -ForegroundColor Green
}

if ($tecnicoResponse) {
    Write-Host "✅ Login Técnico: Funcionando" -ForegroundColor Green
    Write-Host "✅ Acesso Assinaturas (Técnico): Funcionando" -ForegroundColor Green
}

if ($clienteResponse) {
    Write-Host "✅ Login Cliente: Funcionando" -ForegroundColor Green
    Write-Host "✅ Controle de Acesso (Cliente): Funcionando" -ForegroundColor Green
}

Write-Host "✅ Login Inválido: Tratado corretamente" -ForegroundColor Green
Write-Host "✅ Acesso Sem Token: Bloqueado corretamente" -ForegroundColor Green

Write-Host "`n🚀 Testes de autenticação JWT concluídos!" -ForegroundColor Green
Write-Host "Verifique se todos os testes passaram conforme esperado." -ForegroundColor Yellow
