# StudyMate Server Startup Script
# This script ensures both backend and frontend servers are running properly

Write-Host "🚀 Starting StudyMate Servers..." -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Function to kill processes on a port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($process in $processes) {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Write-Host "   Killed process on port $Port" -ForegroundColor Yellow
        }
    } catch {
        # Ignore errors
    }
}

# Check and clear ports
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow

$ports = @(3000, 3001, 5001)
foreach ($port in $ports) {
    if (Test-Port $port) {
        Write-Host "   Port $port is in use - clearing..." -ForegroundColor Yellow
        Stop-ProcessOnPort $port
        Start-Sleep -Seconds 2
    } else {
        Write-Host "   Port $port is available" -ForegroundColor Green
    }
}

Write-Host ""

# Start backend server
Write-Host "🔧 Starting Backend Server (Port 5001)..." -ForegroundColor Yellow
try {
    Start-Process -FilePath "node" -ArgumentList "server-simple.js" -WindowStyle Minimized -PassThru
    Write-Host "   Backend server started" -ForegroundColor Green
} catch {
    Write-Host "   Failed to start backend server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Wait for backend to start
Write-Host "   Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test backend
$backendOk = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $backendOk = $true
            Write-Host "   Backend is responding (attempt $i)" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "   Backend not ready yet (attempt $i/10)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $backendOk) {
    Write-Host "   Backend failed to start properly" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Start frontend server
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Yellow
try {
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Minimized -PassThru
    Write-Host "   Frontend server started" -ForegroundColor Green
} catch {
    Write-Host "   Failed to start frontend server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Wait for frontend to start
Write-Host "   Waiting for frontend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test frontend
$frontendOk = $false
$frontendPort = $null

for ($i = 1; $i -le 10; $i++) {
    foreach ($port in @(3000, 3001)) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port" -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                $frontendOk = $true
                $frontendPort = $port
                Write-Host "   Frontend is responding on port $port (attempt $i)" -ForegroundColor Green
                break
            }
        } catch {
            # Continue to next port
        }
    }
    if ($frontendOk) { break }
    Write-Host "   Frontend not ready yet (attempt $i/10)" -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

Write-Host ""

# Final status
if ($backendOk -and $frontendOk) {
    Write-Host "🎉 ALL SERVERS ARE RUNNING!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Server Status:" -ForegroundColor Cyan
    Write-Host "   Backend:  ✅ Running on http://localhost:5001" -ForegroundColor Green
    Write-Host "   Frontend: ✅ Running on http://localhost:$frontendPort" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Open your browser and go to:" -ForegroundColor Cyan
    Write-Host "   http://localhost:$frontendPort" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Cyan
    Write-Host "   • Keep this terminal open to monitor servers" -ForegroundColor White
    Write-Host "   • Use Ctrl+C to stop all servers" -ForegroundColor White
    Write-Host "   • Check Connection Diagnostics in the app for troubleshooting" -ForegroundColor White
} else {
    Write-Host "❌ SOME SERVERS FAILED TO START" -ForegroundColor Red
    Write-Host ""
    Write-Host "Backend: $($backendOk ? '✅ Running' : '❌ Failed')" -ForegroundColor $(if ($backendOk) { 'Green' } else { 'Red' })
    Write-Host "Frontend: $($frontendOk ? '✅ Running' : '❌ Failed')" -ForegroundColor $(if ($frontendOk) { 'Green' } else { 'Red' })
    Write-Host ""
    Write-Host "🔧 Manual startup commands:" -ForegroundColor Yellow
    Write-Host "   Backend:  node server-simple.js" -ForegroundColor White
    Write-Host "   Frontend: npm run dev" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")














