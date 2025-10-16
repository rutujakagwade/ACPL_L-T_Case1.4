# !/usr/bin/env pwsh
# build-android-debug.ps1 - Build debug APK

# Environment setup
$ErrorActionPreference = "Stop"
$clientPath = "$PSScriptRoot\..\client"
$androidPath = "$clientPath\android"
$debugApkPath = "$androidPath\app\build\outputs\apk\debug\app-debug.apk"

# Verify prerequisites
function Check-Command($cmd) {
    try { Get-Command $cmd -ErrorAction Stop > $null }
    catch { 
        Write-Host "Error: $cmd not found. Please install required tools." -ForegroundColor Red
        exit 1
    }
}

Check-Command "node"
Check-Command "gradlew"

# Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
Set-Location $androidPath
.\gradlew clean

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Set-Location $clientPath
npm install

# Build debug APK
Write-Host "Building debug APK..." -ForegroundColor Yellow
Set-Location $androidPath
.\gradlew assembleDebug

# Verify build success
if (Test-Path $debugApkPath) {
    Write-Host "Build successful! Debug APK location:" -ForegroundColor Green
    Write-Host $debugApkPath
} else {
    Write-Host "Build failed! Check logs for errors." -ForegroundColor Red
    exit 1
}