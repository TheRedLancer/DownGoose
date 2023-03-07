param(
[string]$root
)
$srcFolder = "$root\dist"
$buildFolder = "$root\..\backend\public"
$buildAssets = "$buildFolder\assets"
$buildGoose = "$buildFolder\goose"

npm i --production
npx vite build

if (!(Test-Path $buildFolder -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildFolder
}
if (!(Test-Path $buildAssets -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildBin
}
if (!(Test-Path $buildGoose -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildBinDist
}
copy-item -path "$srcFolder\*" -destination "$buildFolder" -force