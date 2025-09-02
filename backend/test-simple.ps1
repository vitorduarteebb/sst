Write-Host "Teste Simples - Assinaturas Offline" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1"

try {
    Write-Host "Testando GET /assinaturas..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/assinaturas" -Method "GET"
    Write-Host "Sucesso! Encontradas $($response.Count) assinaturas" -ForegroundColor Green
    
    Write-Host "Testando GET /assinaturas/stats..." -ForegroundColor Yellow
    $stats = Invoke-RestMethod -Uri "$baseUrl/assinaturas/stats" -Method "GET"
    Write-Host "Sucesso! Estatisticas: Total=$($stats.total)" -ForegroundColor Green
    
    Write-Host "Testando POST /assinaturas/sync..." -ForegroundColor Yellow
    $sync = Invoke-RestMethod -Uri "$baseUrl/assinaturas/sync" -Method "POST"
    Write-Host "Sucesso! Sincronizacao: $($sync.totalSincronizadas) sincronizadas" -ForegroundColor Green
    
    Write-Host "Todos os testes passaram!" -ForegroundColor Green
}
catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}
