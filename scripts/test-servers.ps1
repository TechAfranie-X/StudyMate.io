# StudyMate Server Test Script
Write-Host "🔍 Testing StudyMate Servers..." -ForegroundColor Cyan
Write-Host ""

# Test Backend (Port 5001)
Write-Host "🧪 Testing Backend (Port 5001)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -TimeoutSec 5
    if ($backendResponse.StatusCode -eq 200) {
        $backendData = $backendResponse.Content | ConvertFrom-Json
        Write-Host "✅ Backend is RUNNING" -ForegroundColor Green
        Write-Host "   Status: $($backendData.status)" -ForegroundColor Green
        Write-Host "   Message: $($backendData.message)" -ForegroundColor Green
        $backendOk = $true
    } else {
        Write-Host "❌ Backend returned status: $($backendResponse.StatusCode)" -ForegroundColor Red
        $backendOk = $false
    }
} catch {
    Write-Host "❌ Backend is NOT RUNNING" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $backendOk = $false
}

Write-Host ""

# Test Frontend (Port 3000)
Write-Host "🧪 Testing Frontend (Port 3000)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is RUNNING" -ForegroundColor Green
        Write-Host "   Status: $($frontendResponse.StatusCode)" -ForegroundColor Green
        $frontendOk = $true
    } else {
        Write-Host "❌ Frontend returned status: $($frontendResponse.StatusCode)" -ForegroundColor Red
        $frontendOk = $false
    }
} catch {
    Write-Host "❌ Frontend is NOT RUNNING" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $frontendOk = $false
}

Write-Host ""

# Summary
Write-Host "📊 SERVER STATUS SUMMARY:" -ForegroundColor Magenta
Write-Host "Backend (Port 5001): $(if ($backendOk) { '✅ RUNNING' } else { '❌ NOT RUNNING' })" -ForegroundColor $(if ($backendOk) { 'Green' } else { 'Red' })
Write-Host "Frontend (Port 3000): $(if ($frontendOk) { '✅ RUNNING' } else { '❌ NOT RUNNING' })" -ForegroundColor $(if ($frontendOk) { 'Green' } else { 'Red' })

Write-Host ""

if ($backendOk -and $frontendOk) {
    Write-Host "🎉 ALL SERVERS ARE RUNNING!" -ForegroundColor Green
    Write-Host "🌐 Open your browser and go to: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API available at: http://localhost:5001" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ SOME SERVERS ARE NOT RUNNING" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 To start servers manually:" -ForegroundColor Cyan
    Write-Host "1. Backend: npm run server:simple" -ForegroundColor White
    Write-Host "2. Frontend: npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Make sure to run these in separate terminal windows!" -ForegroundColor Yellow
}
