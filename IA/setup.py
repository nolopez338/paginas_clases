#!/usr/bin/env python3
"""
Script de instalación para la IA de Predicción de Nota
"""

import subprocess
import sys
import os

def verificar_python():
    """Verifica que la versión de Python sea compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print("❌ Error: Se requiere Python 3.9 o superior")
        print(f"   Versión actual: {version.major}.{version.minor}.{version.micro}")
        return False
    else:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True

def instalar_dependencias():
    """Instala las dependencias del proyecto"""
    print("\n📦 Instalando dependencias...")
    
    try:
        # Actualizar pip
        print("   Actualizando pip...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
        
        # Instalar dependencias
        print("   Instalando bibliotecas...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        
        print("✅ Dependencias instaladas correctamente")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al instalar dependencias: {e}")
        return False
    except FileNotFoundError:
        print("❌ Error: No se encontró el archivo requirements.txt")
        return False

def verificar_instalacion():
    """Verifica que todas las bibliotecas estén instaladas correctamente"""
    print("\n🔍 Verificando instalación...")
    
    bibliotecas = [
        "pandas",
        "numpy", 
        "matplotlib",
        "sklearn"
    ]
    
    todas_instaladas = True
    
    for lib in bibliotecas:
        try:
            __import__(lib)
            print(f"   ✅ {lib}")
        except ImportError:
            print(f"   ❌ {lib} - No instalada")
            todas_instaladas = False
    
    return todas_instaladas

def mostrar_instrucciones():
    """Muestra las instrucciones de uso"""
    print("\n" + "=" * 60)
    print("🎓 IA DE PREDICCIÓN DE NOTA - INSTALACIÓN COMPLETADA")
    print("=" * 60)
    print("\n📋 Instrucciones de uso:")
    print("   1. Ejecutar el programa principal:")
    print("      python main.py")
    print("\n   2. Experimentar con datos aleatorios:")
    print("      python experimentar_datos.py")
    print("\n   3. Ver la documentación:")
    print("      cat README.md")
    print("\n🎯 ¡Listo para usar!")

def main():
    """Función principal del script de instalación"""
    print("🚀 INSTALADOR - IA DE PREDICCIÓN DE NOTA")
    print("=" * 50)
    
    # Verificar Python
    if not verificar_python():
        sys.exit(1)
    
    # Instalar dependencias
    if not instalar_dependencias():
        sys.exit(1)
    
    # Verificar instalación
    if not verificar_instalacion():
        print("\n❌ Algunas bibliotecas no se instalaron correctamente")
        print("   Intenta ejecutar manualmente: pip install -r requirements.txt")
        sys.exit(1)
    
    # Mostrar instrucciones
    mostrar_instrucciones()

if __name__ == "__main__":
    main() 