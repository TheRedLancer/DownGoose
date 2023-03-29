param(
[string]$root
)
if (!($root)) {
    echo "Missing root dir param"
    exit
}
$srcFolder = "$root\frontend\dist"
$buildFolder = "$root\backend\public"
$buildAssets = "$buildFolder\assets"
$buildGoose = "$buildFolder\goose"

cd $root\frontend
npm i
npm run build
cd ..

if (!(Test-Path $buildFolder -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildFolder
}
if (!(Test-Path $buildAssets -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildAssets
}
if (!(Test-Path $buildGoose -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $buildGoose
}
copy-item -path "$srcFolder\*" -destination "$buildFolder" -force -Recurse