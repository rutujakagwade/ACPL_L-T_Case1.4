# !/usr/bin/env pwsh
# dev-start.ps1 - Start full development environment

# Check if MongoDB is running
$mongoStatus = Get-Service MongoDB -ErrorAction SilentlyContinue
if ($null -eq $mongoStatus -or $mongoStatus.Status -ne "Running") {
    Write-Host "Starting MongoDB service..."
    Start-Service MongoDB
}

# Start backend server
Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\..\backend\backend; npm run dev"

# Start frontend development server
Write-Host "Starting frontend development server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\..\client; npm start"

Write-Host "Development environment started!"
Write-Host "Backend running on: http://localhost:5000"
Write-Host "Frontend Metro bundler on: http://localhost:19000"
Write-Host "Press Ctrl+C in individual terminals to stop servers"