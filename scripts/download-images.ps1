$ErrorActionPreference = 'Continue'
$outDir = 'C:\Users\QWERTY\Downloads\kazi\cbs-website\public\images'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$imgs = @{
  'hero.jpg'         = 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1920&q=75'
  'about.jpg'        = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=70'
  'port.jpg'         = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=70'
  'ship.jpg'         = 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1600&q=70'
  'dock.jpg'         = 'https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?auto=format&fit=crop&w=1600&q=70'
  'containers.jpg'   = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=70'
  'vessel.jpg'       = 'https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&w=1600&q=70'
}

foreach ($key in $imgs.Keys) {
  $path = Join-Path $outDir $key
  try {
    Invoke-WebRequest -Uri $imgs[$key] -OutFile $path -TimeoutSec 60
    $len = (Get-Item $path).Length
    Write-Output "OK $key ($len bytes)"
  } catch {
    Write-Output "ERR $key :: $($_.Exception.Message)"
  }
}