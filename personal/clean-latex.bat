@echo off
echo Deleting LaTeX auxiliary files recursively...

del /s /q *.aux 2>nul
del /s /q *.synctex.gz 2>nul
del /s /q *.log 2>nul
del /s /q *.out 2>nul
del /s /q *.toc 2>nul

echo Done.
pause