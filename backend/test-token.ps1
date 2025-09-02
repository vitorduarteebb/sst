# Teste simples de token JWT
$loginData = @{
    email = "admin@sst.com"
    password = "password"
}

Write-Host "Fazendo login..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body ($loginData | ConvertTo-Json)

Write-Host "Token obtido:" -ForegroundColor Green
Write-Host $response.access_token -ForegroundColor Cyan

$token = $response.access_token

Write-Host "`nTestando endpoint protegido..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $result = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" -Method GET -Headers $headers
    Write-Host "SUCESSO! Perfil obtido:" -ForegroundColor Green
    Write-Host ($result | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "ERRO ao acessar perfil:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
