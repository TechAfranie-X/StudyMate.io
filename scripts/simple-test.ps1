Write-Host "Testing StudyMate Servers..." -ForegroundColor Cyan
Write-Host ""

# Test Backend
Write-Host "Testing Backend..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -TimeoutSec 5
    Write-Host "Backend is RUNNING" -ForegroundColor Green
    $backendOk = $true
} catch {
    Write-Host "Backend is NOT RUNNING" -ForegroundColor Red
    $backendOk = $false
}

Write-Host ""

# Test Frontend
Write-Host "Testing Frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "Frontend is RUNNING" -ForegroundColor Green
    $frontendOk = $true
} catch {
    Write-Host "Frontend is NOT RUNNING" -ForegroundColor Red
    $frontendOk = $false
}

Write-Host ""

if ($backendOk -and $frontendOk) {
    Write-Host "ALL SERVERS ARE RUNNING!" -ForegroundColor Green
    Write-Host "Open your browser and go to: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "SOME SERVERS ARE NOT RUNNING" -ForegroundColor Yellow
    Write-Host "To start servers:" -ForegroundColor Cyan
    Write-Host "1. Backend: npm run server:simple" -ForegroundColor White
    Write-Host "2. Frontend: npm run dev" -ForegroundColor White
}














