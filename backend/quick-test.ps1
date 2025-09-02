Write-Host "🧪 Teste Rápido - Endpoints de Ordens de Serviço" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1"

try {
    Write-Host "`n📡 Testando GET /ordens-servico..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/ordens-servico" -Method "GET"
    Write-Host "✅ Sucesso! Encontradas $($response.Count) ordens de serviço" -ForegroundColor Green
    
    Write-Host "`n📡 Testando GET /ordens-servico/stats..." -ForegroundColor Yellow
    $stats = Invoke-RestMethod -Uri "$baseUrl/ordens-servico/stats" -Method "GET"
    Write-Host "✅ Sucesso! Estatísticas: Total=$($stats.total)" -ForegroundColor Green
    
    Write-Host "`n📡 Testando GET /ordens-servico/1..." -ForegroundColor Yellow
    $detail = Invoke-RestMethod -Uri "$baseUrl/ordens-servico/1" -Method "GET"
    Write-Host "✅ Sucesso! Ordem encontrada: $($detail.titulo)" -ForegroundColor Green
    
    Write-Host "`n🎯 Todos os testes passaram! Módulo funcionando perfeitamente!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Certifique-se de que o servidor está rodando em http://localhost:3001" -ForegroundColor Yellow
}
