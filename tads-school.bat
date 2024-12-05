@echo off
chcp 65001
REM Obter o caminho completo do arquivo .bat
set "current_path=%~dp0"

REM Adicionar o nome do arquivo PowerShell ao caminho
set "script_path=%current_path%start.ps1"

REM Exibir o caminho encontrado (para depuração, opcional)
echo Caminho do script PowerShell: %script_path%

REM Usar o caminho do arquivo
powershell -ExecutionPolicy Bypass -File "%script_path%"

pause