# StudyMate Connection Test Script
Write-Host "🚀 StudyMate Connection Test`n" -ForegroundColor Green

# Test Backend
Write-Host "🧪 Testing backend connectivity..." -ForegroundColor Yellow

try {
    # Test health endpoint
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "✅ Health check: $($healthData.status) - $($healthData.message)" -ForegroundColor Green
    
    # Test tasks endpoint
    $tasksResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/tasks" -Method GET
    $tasksData = $tasksResponse.Content | ConvertFrom-Json
    Write-Host "✅ Tasks endpoint: Working" -ForegroundColor Green
    Write-Host "   Found $($tasksData.data.Count) tasks" -ForegroundColor Cyan
    
    # Test authentication
    $authBody = @{
        email = "test@example.com"
        password = "password"
    } | ConvertTo-Json
    
    $authResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/auth/login" -Method POST -Body $authBody -ContentType "application/json"
    $authData = $authResponse.Content | ConvertFrom-Json
    Write-Host "✅ Authentication: Working" -ForegroundColor Green
    
    $backendOk = $true
} catch {
    Write-Host "❌ Backend test failed: $($_.Exception.Message)" -ForegroundColor Red
    $backendOk = $false
}

# Test Frontend
Write-Host "`n🧪 Testing frontend connectivity..." -ForegroundColor Yellow

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    Write-Host "✅ Frontend is accessible (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
    $frontendOk = $true
} catch {
    Write-Host "❌ Frontend test failed: $($_.Exception.Message)" -ForegroundColor Red
    $frontendOk = $false
}

# Results
Write-Host "`n📊 Test Results:" -ForegroundColor Magenta
Write-Host "Backend: $($backendOk ? '✅ PASS' : '❌ FAIL')" -ForegroundColor $(if ($backendOk) { 'Green' } else { 'Red' })
Write-Host "Frontend: $($frontendOk ? '✅ PASS' : '❌ FAIL')" -ForegroundColor $(if ($frontendOk) { 'Green' } else { 'Red' })

if ($backendOk -and $frontendOk) {
    Write-Host "`n🎉 All tests passed! StudyMate is ready to use." -ForegroundColor Green
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
    Write-Host "2. Login with any email/password (mock authentication)" -ForegroundColor White
    Write-Host "3. Verify tasks are displayed on the dashboard" -ForegroundColor White
    Write-Host "4. Test creating, editing, and deleting tasks" -ForegroundColor White
} else {
    Write-Host "`n⚠️ Some tests failed. Check the server logs above." -ForegroundColor Yellow
}














