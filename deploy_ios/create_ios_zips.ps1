# Create iOS zip archives for Xcode/TestFlight
# Run from project root (folder containing app/ and prosto_taxi_driver/):
#   cd c:\Users\user\CascadeProjects\2048
#   .\deploy_ios\create_ios_zips.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot | Split-Path -Parent
$outDir = $PSScriptRoot

if (-not (Test-Path "$root\app")) { throw "Folder not found: $root\app" }
if (-not (Test-Path "$root\prosto_taxi_driver")) { throw "Folder not found: $root\prosto_taxi_driver" }

$clientZip = Join-Path $outDir "Trezvyi_voditel_Nol_Promille_client.zip"
$driverZip  = Join-Path $outDir "Nol_Promille_voditel_driver.zip"

Write-Host "Creating client app zip..."
if (Test-Path $clientZip) { Remove-Item $clientZip -Force }
Compress-Archive -Path "$root\app" -DestinationPath $clientZip
Write-Host "  -> $clientZip" -ForegroundColor Green

Write-Host "Creating driver app zip..."
if (Test-Path $driverZip) { Remove-Item $driverZip -Force }
Compress-Archive -Path "$root\prosto_taxi_driver" -DestinationPath $driverZip
Write-Host "  -> $driverZip" -ForegroundColor Green

Write-Host "Done. Copy README.md and both zip files to your Mac."
