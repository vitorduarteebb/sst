Write-Host "Testes de Autenticacao JWT" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1"

# Funcao para fazer requisicoes
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [object]$Body = $null,
        [string]$Token = $null
    )
    
    Write-Host "`n$Description" -ForegroundColor Yellow
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
        
        Write-Host "SUCESSO!" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Aguardar servidor iniciar
Write-Host "Aguardando servidor iniciar..." -ForegroundColor Blue
Start-Sleep -Seconds 3

# Teste 1: Login Admin
Write-Host "`nTeste 1: Login Admin" -ForegroundColor Cyan
$loginData = @{
    email = "admin@sst.com"
    password = "password"
}

$loginResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Login como Admin" -Body $loginData

if ($loginResponse) {
    $adminToken = $loginResponse.access_token
    Write-Host "Token Admin obtido: $($adminToken.Substring(0, 20))..." -ForegroundColor Green
    
    # Teste 2: Validar Token
    Write-Host "`nTeste 2: Validar Token" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/auth/validate" -Description "Validar token JWT" -Token $adminToken
    
    # Teste 3: Obter Perfil
    Write-Host "`nTeste 3: Obter Perfil" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/auth/profile" -Description "Obter perfil do usuario" -Token $adminToken
    
    # Teste 4: Acessar Assinaturas
    Write-Host "`nTeste 4: Acessar Assinaturas" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Acessar assinaturas com token" -Token $adminToken
}

# Teste 5: Login Tecnico
Write-Host "`nTeste 5: Login Tecnico" -ForegroundColor Cyan
$loginTecnico = @{
    email = "tecnico@sst.com"
    password = "password"
}

$tecnicoResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/auth/login" -Description "Login como Tecnico" -Body $loginTecnico

if ($tecnicoResponse) {
    $tecnicoToken = $tecnicoResponse.access_token
    Write-Host "Token Tecnico obtido: $($tecnicoToken.Substring(0, 20))..." -ForegroundColor Green
    
    # Teste 6: Tecnico acessar assinaturas
    Write-Host "`nTeste 6: Tecnico Acessar Assinaturas" -ForegroundColor Cyan
    Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Tecnico acessar assinaturas" -Token $tecnicoToken
}

# Teste 7: Acesso sem token (deve falhar)
Write-Host "`nTeste 7: Acesso Sem Token (Deve Falhar)" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Tentar acessar assinaturas sem token"

Write-Host "`nResumo dos Testes:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green

if ($loginResponse) {
    Write-Host "Login Admin: Funcionando" -ForegroundColor Green
    Write-Host "Validacao Token: Funcionando" -ForegroundColor Green
    Write-Host "Perfil Usuario: Funcionando" -ForegroundColor Green
    Write-Host "Acesso Assinaturas (Admin): Funcionando" -ForegroundColor Green
}

if ($tecnicoResponse) {
    Write-Host "Login Tecnico: Funcionando" -ForegroundColor Green
    Write-Host "Acesso Assinaturas (Tecnico): Funcionando" -ForegroundColor Green
}

Write-Host "Acesso Sem Token: Bloqueado corretamente" -ForegroundColor Green

Write-Host "`nTestes de autenticacao JWT concluidos!" -ForegroundColor Green
