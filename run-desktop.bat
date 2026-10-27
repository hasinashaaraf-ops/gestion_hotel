@echo off
title Hotel de Reve - Application Desktop Java Swing

echo ========================================================
echo   Lancement de Hotel de Reve - Java Swing Desktop
echo ========================================================
echo:

:: Se placer dans java-swing-project si present
if exist "java-swing-project\src\main\java" cd java-swing-project

:: Creer le dossier bin si inexistant
if not exist "bin" mkdir bin

echo [1/2] Compilation des fichiers Java avec javac...
dir /s /b src\main\java\*.java > sources.txt 2>nul
javac -encoding UTF-8 -d bin @sources.txt
if errorlevel 1 goto erreur_compile
del sources.txt 2>nul

echo [2/2] Demarrage de l'application Desktop (Fenetre Swing)...
echo:
java -cp bin com.hoteldereve.MainApp
goto fin

:erreur_compile
del sources.txt 2>nul
echo:
echo ============================================================
echo [ERREUR] La compilation a echoue.
echo ============================================================

:fin
echo:
echo ============================================================
echo   Fenetre de controle terminee.
echo ============================================================
pause
