$indexPath = Join-Path (Get-Location) "index.html"

$deployVersion = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")
$html = Get-Content -Path $indexPath -Raw -Encoding UTF8

$html = [regex]::Replace(
  $html,
  'window\.__DEPLOY_VERSION__ = "[^"]+";',
  "window.__DEPLOY_VERSION__ = `"$deployVersion`";"
)
$html = [regex]::Replace($html, 'styles\.css\?v=[^"]+', "styles.css?v=$deployVersion")
$html = [regex]::Replace($html, 'app\.js\?v=[^"]+', "app.js?v=$deployVersion")

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($indexPath, $html, $utf8NoBom)
Write-Output "Updated deploy version: $deployVersion"
