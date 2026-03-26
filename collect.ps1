$OutputFile = "project_code.txt"
$ConfigFiles = @("package.json", "vite.config.ts", "index.html", ".prettierrc", "tsconfig.json")
$Extensions = @("*.ts", "*.tsx", "*.css", "*.scss")

# Удаляем старый файл, если он есть
if (Test-Path $OutputFile) { Remove-Item $OutputFile }

# 1. Сборка конфигов
foreach ($file in $ConfigFiles) {
    if (Test-Path $file) {
        Write-Host "Processing: $file"
        "// ==========================================" | Add-Content -Path $OutputFile
        "// FILE: $file" | Add-Content -Path $OutputFile
        "// ==========================================" | Add-Content -Path $OutputFile
        Get-Content $file | Add-Content -Path $OutputFile
        "`n" | Add-Content -Path $OutputFile
    }
}

# 2. Сборка src
if (Test-Path "src") {
    Write-Host "Scanning src..."
    $files = Get-ChildItem -Path "src" -Include $Extensions -Recurse
    foreach ($f in $files) {
        Write-Host "Adding: $($f.Name)"
        "// ==========================================" | Add-Content -Path $OutputFile
        "// FILE: $($f.FullName)" | Add-Content -Path $OutputFile
        "// ==========================================" | Add-Content -Path $OutputFile
        Get-Content $f.FullName | Add-Content -Path $OutputFile
        "`n" | Add-Content -Path $OutputFile
    }
}

Write-Host "Done! Check $OutputFile" -ForegroundColor Green
