# Script para testar endpoints de Ordens de Serviço
Write-Host "🧪 Testando Endpoints de Ordens de Serviço" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$baseUrl = "http://localhost:3001"

# Função para fazer requisições com tratamento de erro
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [object]$Body = $null
    )
    
    Write-Host "`n📡 $Description" -ForegroundColor Yellow
    Write-Host "URL: $Method $Url" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body ($Body | ConvertTo-Json -Depth 10)
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers
        }
        
        Write-Host "✅ Sucesso!" -ForegroundColor Green
        Write-Host "Resposta: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor White
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
Start-Sleep -Seconds 2

# 1. Testar GET /ordens-servico (listar todas)
$listResponse = Test-Endpoint -Method "GET" -Url "$baseUrl/ordens-servico" -Description "Listar todas as ordens de serviço"

# 2. Testar GET /ordens-servico/stats (estatísticas)
$statsResponse = Test-Endpoint -Method "GET" -Url "$baseUrl/ordens-servico/stats" -Description "Obter estatísticas das ordens de serviço"

# 3. Testar GET /ordens-servico/:id (buscar por ID)
if ($listResponse -and $listResponse.Count -gt 0) {
    $firstId = $listResponse[0].id
    Test-Endpoint -Method "GET" -Url "$baseUrl/ordens-servico/$firstId" -Description "Buscar ordem de serviço por ID"
}

# 4. Testar GET /ordens-servico/:id (ID inexistente)
Test-Endpoint -Method "GET" -Url "$baseUrl/ordens-servico/999" -Description "Buscar ordem de serviço com ID inexistente"

# 5. Testar filtros (se implementados)
Write-Host "`n🔍 Testando filtros..." -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/ordens-servico?status=PENDENTE" -Description "Filtrar por status PENDENTE"
Test-Endpoint -Method "GET" -Url "$baseUrl/ordens-servico?prioridade=ALTA" -Description "Filtrar por prioridade ALTA"
Test-Endpoint -Method "GET" -Url "$baseUrl/ordens-servico?tipo=MANUTENCAO" -Description "Filtrar por tipo MANUTENCAO"

Write-Host "`n🎯 Resumo dos Testes:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green

if ($listResponse) {
    Write-Host "✅ Listagem: $($listResponse.Count) ordens encontradas" -ForegroundColor Green
} else {
    Write-Host "❌ Listagem: Falhou" -ForegroundColor Red
}

if ($statsResponse) {
    Write-Host "✅ Estatísticas: Total=$($statsResponse.total), Pendentes=$($statsResponse.pendentes)" -ForegroundColor Green
} else {
    Write-Host "❌ Estatísticas: Falhou" -ForegroundColor Red
}

Write-Host "`n🚀 Testes concluídos! Verifique os resultados acima." -ForegroundColor Green
