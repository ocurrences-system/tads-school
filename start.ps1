# Verifica se o Node.js está instalado
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js nao esta instalado. Instalando Node.js com winget..." -ForegroundColor Yellow
    try {
        winget install --id OpenJS.NodeJS -e --silent -Wait
        Write-Host "Node.js instalado com sucesso." -ForegroundColor Green
    } catch {
        Write-Host "Falha ao instalar o Node.js. Certifique-se de que o winget esta instalado e funcionando." -ForegroundColor Red
        Pause
        Exit 1
    }
} else {
    Write-Host "Node.js ja esta instalado." -ForegroundColor Green
}

# Verifica se o arquivo package.json existe
if (-not (Test-Path "./package.json")) {
    Write-Host "O arquivo package.json nao foi encontrado no diretorio atual." -ForegroundColor Red
    Write-Host "Certifique-se de estar no diretorio correto antes de executar o script." -ForegroundColor Yellow
    Pause
    Exit 1
}

# Instala as dependencias do projeto
Write-Host "Instalando dependencias..." -ForegroundColor Cyan
try {
    npm install | Out-Null
    Write-Host "Dependencias instaladas com sucesso." -ForegroundColor Green
} catch {
    Write-Host "Falha ao instalar dependencias. Verifique erros no npm." -ForegroundColor Red
    Pause
    Exit 1
}

# Executa o prisma generate
Write-Host "Gerando artefatos do Prisma..." -ForegroundColor Cyan
try {
    npx prisma generate | Out-Null
    Write-Host "Artefatos do Prisma gerados com sucesso." -ForegroundColor Green
} catch {
    Write-Host "Falha ao gerar artefatos do Prisma. Verifique erros no Prisma." -ForegroundColor Red
    Pause
    Exit 1
}

# Inicia o servidor da aplicacao
Write-Host "Iniciando a aplicacao..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npm run dev"

# Aguarda o servidor iniciar
Write-Host "Aguardando o servidor iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Abre o navegador na pagina auth/login
Write-Host "Abrindo o navegador na pagina login..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/auth/login"

Write-Host "Tudo pronto! O servidor esta rodando e o navegador foi aberto." -ForegroundColor Green
Pause
