@echo off
REM Configurações iniciais
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Verifica se o arquivo populateAdminOnly.ts existe
if not exist "populateAdminOnly.ts" (
    echo [ERRO] O arquivo populateAdminOnly.ts nao foi encontrado no diretorio atual.
    echo Certifique-se de estar no diretorio correto antes de executar este script.
    pause
    exit /b 1
)

REM Executa o comando para popular o banco de dados
echo [INFO] Iniciando a populacao do banco de dados...
npx ts-node populateAdminOnly.ts

REM Verifica se o comando foi executado com sucesso
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao executar populateAdminOnly.ts. Verifique os erros acima.
    pause
    exit /b 1
)

echo [SUCESSO] Banco de dados populado com sucesso!
pause
