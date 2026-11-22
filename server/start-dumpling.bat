@echo off
cd /d "%~dp0"
:loop
node server.mjs
echo Dumpling brain stopped. Restarting in 5s...
timeout /t 5 >nul
goto loop
