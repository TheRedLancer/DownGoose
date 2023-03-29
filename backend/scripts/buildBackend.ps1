if (!(Test-Path "dist\public" -PathType Container)) {
    New-Item -ItemType Directory -Force -Path "dist\public"
}
copy-item -path "public\*" -destination "dist\public" -force -Recurse