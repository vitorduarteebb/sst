Write-Host "🧪 Testes de Assinaturas Offline" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1"

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
Start-Sleep -Seconds 2

# 1. Teste: Criar assinatura offline
Write-Host "`n🎯 Teste 1: Criar Assinatura Offline" -ForegroundColor Cyan
$assinaturaData = @{
    id = "local-$(Get-Date -Format 'yyyyMMddHHmmss')"
    tipo = "CHECKLIST"
    documentoId = "checklist-001"
    responsavelNome = "João Silva"
    responsavelCpf = "123.456.789-00"
    responsavelCargo = "Técnico de Segurança"
    dadosAssinatura = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    observacoes = "Assinatura coletada offline"
    dataAssinatura = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    latitude = "-23.5505"
    longitude = "-46.6333"
    empresaId = "empresa-1"
    unidadeId = "unidade-1"
    status = "PENDENTE"
}

$assinaturaCriada = Test-Endpoint -Method "POST" -Url "$baseUrl/assinaturas" -Description "Criar assinatura offline" -Body $assinaturaData

# 2. Teste: Verificar assinatura pendente
Write-Host "`n🎯 Teste 2: Verificar Assinatura Pendente" -ForegroundColor Cyan
$assinaturasPendentes = Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas/pending" -Description "Listar assinaturas pendentes"

# 3. Teste: Obter estatísticas
Write-Host "`n🎯 Teste 3: Obter Estatísticas" -ForegroundColor Cyan
$stats = Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas/stats" -Description "Obter estatísticas das assinaturas"

# 4. Teste: Sincronizar assinaturas
Write-Host "`n🎯 Teste 4: Sincronizar Assinaturas" -ForegroundColor Cyan
$sincronizacao = Test-Endpoint -Method "POST" -Url "$baseUrl/assinaturas/sync" -Description "Sincronizar assinaturas pendentes"

# 5. Teste: Verificar assinatura sincronizada
Write-Host "`n🎯 Teste 5: Verificar Assinatura Sincronizada" -ForegroundColor Cyan
if ($assinaturaCriada) {
    $assinaturaAtualizada = Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas/$($assinaturaCriada.id)" -Description "Verificar assinatura sincronizada"
}

# 6. Teste: Criar múltiplas assinaturas para testar fila
Write-Host "`n🎯 Teste 6: Criar Múltiplas Assinaturas" -ForegroundColor Cyan
for ($i = 1; $i -le 3; $i++) {
    $assinaturaData.id = "local-$(Get-Date -Format 'yyyyMMddHHmmss')-$i"
    $assinaturaData.documentoId = "checklist-00$i"
    $assinaturaData.observacoes = "Assinatura $i coletada offline"
    
    Test-Endpoint -Method "POST" -Url "$baseUrl/assinaturas" -Description "Criar assinatura offline $i" -Body $assinaturaData
}

# 7. Teste: Forçar sincronização específica
Write-Host "`n🎯 Teste 7: Forçar Sincronização Específica" -ForegroundColor Cyan
if ($assinaturaCriada) {
    Test-Endpoint -Method "POST" -Url "$baseUrl/assinaturas/$($assinaturaCriada.id)/sync" -Description "Forçar sincronização de assinatura específica"
}

# 8. Teste: Listar todas as assinaturas
Write-Host "`n🎯 Teste 8: Listar Todas as Assinaturas" -ForegroundColor Cyan
$todasAssinaturas = Test-Endpoint -Method "GET" -Url "$baseUrl/assinaturas" -Description "Listar todas as assinaturas"

Write-Host "`n🎯 Resumo dos Testes:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green

if ($assinaturaCriada) {
    Write-Host "✅ Assinatura criada: $($assinaturaCriada.id)" -ForegroundColor Green
}

if ($assinaturasPendentes) {
    Write-Host "✅ Assinaturas pendentes: $($assinaturasPendentes.Count)" -ForegroundColor Green
}

if ($stats) {
    Write-Host "✅ Estatísticas: Total=$($stats.total), Pendentes=$($stats.pendentes), Confirmadas=$($stats.confirmadas)" -ForegroundColor Green
}

if ($sincronizacao) {
    Write-Host "✅ Sincronização: $($sincronizacao.totalSincronizadas) sincronizadas, $($sincronizacao.totalErros) erros" -ForegroundColor Green
}

if ($todasAssinaturas) {
    Write-Host "✅ Total de assinaturas: $($todasAssinaturas.Count)" -ForegroundColor Green
}

Write-Host "`n🚀 Testes de assinaturas offline concluídos!" -ForegroundColor Green
Write-Host "💡 Verifique se não houve perda de dados durante os testes." -ForegroundColor Yellow
