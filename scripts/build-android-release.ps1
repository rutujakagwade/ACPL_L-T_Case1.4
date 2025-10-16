# !/usr/bin/env pwsh
# build-android-release.ps1 - Build signed release APK

param(
    [Parameter(Mandatory=$true)]
    [string]$KeystorePassword,
    [Parameter(Mandatory=$true)]
    [string]$KeyPassword
)

$ErrorActionPreference = "Stop"
$clientPath = "$PSScriptRoot\..\client"
$androidPath = "$clientPath\android"
$releaseApkPath = "$androidPath\app\build\outputs\apk\release\app-release.apk"

# Verify keystore exists
$keystorePath = "$androidPath\app\debug.keystore"
if (-not (Test-Path $keystorePath)) {
    Write-Host "Error: Keystore not found at $keystorePath" -ForegroundColor Red
    Write-Host "Please generate a keystore first." -ForegroundColor Red
    exit 1
}

# Clean and build
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
Set-Location $androidPath
.\gradlew clean

# Set up release signing
$gradleProperties = @"
MYAPP_UPLOAD_STORE_FILE=debug.keystore
MYAPP_UPLOAD_KEY_ALIAS=androiddebugkey
MYAPP_UPLOAD_STORE_PASSWORD=$KeystorePassword
MYAPP_UPLOAD_KEY_PASSWORD=$KeyPassword
"@
Set-Content -Path "$androidPath\gradle.properties" -Value $gradleProperties

# Build release APK
Write-Host "Building release APK..." -ForegroundColor Yellow
.\gradlew assembleRelease

# Verify build success
if (Test-Path $releaseApkPath) {
    Write-Host "Build successful! Release APK location:" -ForegroundColor Green
    Write-Host $releaseApkPath
} else {
    Write-Host "Build failed! Check logs for errors." -ForegroundColor Red
    exit 1
}