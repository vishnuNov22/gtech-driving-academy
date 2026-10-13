@echo off
cd /d "%~dp0"
where npm >nul 2>nul || (echo Node.js is not installed. Opening nodejs.org - install the LTS version, then run this again. & start https://nodejs.org & pause & exit /b 1)
if not exist node_modules (echo Installing packages - first time only, 2-5 minutes... & call npm install --no-audit --no-fund || (echo Install failed. Copy the error above and send it to Claude. & pause & exit /b 1))
start "" http://localhost:3000
call npm run dev
pause
