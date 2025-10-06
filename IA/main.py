import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import pickle
import os

def crear_datos_ejemplo():
    """Crea el conjunto de datos de ejemplo"""
    datos = {
        'Horas': [1, 2, 3, 4, 5],
        'Nota': [2.0, 4.0, 5.0, 4.5, 6.0]
    }
    return pd.DataFrame(datos)

def generar_datos_aleatorios(n_muestras=20):
    """Genera datos aleatorios para experimentar con diferentes tamaños de muestra"""
    np.random.seed(42)  # Para reproducibilidad
    horas = np.random.uniform(0.5, 8.0, n_muestras)
    # Simula una relación lineal con ruido
    notas = 0.8 * horas + 1.5 + np.random.normal(0, 0.5, n_muestras)
    # Limita las notas entre 0 y 10
    notas = np.clip(notas, 0, 10)
    
    datos = {
        'Horas': horas,
        'Nota': notas
    }
    return pd.DataFrame(datos)

def entrenar_modelo(X, y):
    """Entrena el modelo de regresión lineal"""
    modelo = LinearRegression()
    modelo.fit(X, y)
    return modelo

def mostrar_resultados(modelo, X, y):
    """Muestra los resultados del modelo en consola"""
    # Obtener coeficientes
    m = modelo.coef_[0]
    b = modelo.intercept_
    
    # Calcular R²
    y_pred = modelo.predict(X)
    r2 = r2_score(y, y_pred)
    
    print("=" * 50)
    print("RESULTADOS DEL MODELO DE REGRESIÓN LINEAL")
    print("=" * 50)
    print(f"Ecuación aproximada: y = {m:.3f}·x + {b:.3f}")
    print(f"Coeficiente de determinación R²: {r2:.4f}")
    print("=" * 50)
    
    return m, b, r2

def graficar_resultados(X, y, modelo, m, b):
    """Crea la gráfica con puntos originales y línea de regresión"""
    plt.figure(figsize=(10, 6))
    
    # Graficar puntos originales
    plt.scatter(X, y, color='blue', s=100, alpha=0.7, label='Datos originales')
    
    # Crear línea de regresión
    X_line = np.linspace(X.min() - 0.5, X.max() + 0.5, 100)
    y_line = m * X_line + b
    plt.plot(X_line, y_line, color='red', linewidth=2, label=f'y = {m:.3f}x + {b:.3f}')
    
    # Configurar gráfica
    plt.xlabel('Horas de Estudio', fontsize=12)
    plt.ylabel('Nota Obtenida', fontsize=12)
    plt.title('Predicción de Nota vs Horas de Estudio', fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    plt.legend()
    
    # Ajustar límites
    plt.xlim(0, max(X.max() + 1, 6))
    plt.ylim(0, 10)
    
    plt.tight_layout()
    plt.show()

def predecir_nota(modelo):
    """Solicita horas de estudio al usuario y predice la nota"""
    while True:
        try:
            print("\n" + "=" * 50)
            print("PREDICCIÓN DE NOTA")
            print("=" * 50)
            horas = float(input("Introduce las horas de estudio previstas: "))
            
            if horas < 0:
                print("❌ Error: Las horas no pueden ser negativas. Intenta de nuevo.")
                continue
                
            # Realizar predicción
            prediccion = modelo.predict([[horas]])[0]
            prediccion = np.clip(prediccion, 0, 10)  # Limitar entre 0 y 10
            
            print(f"\n📚 Horas de estudio: {horas}")
            print(f"📊 Nota predicha: {prediccion:.2f}/10")
            
            # Dar recomendación
            if prediccion >= 7:
                print("✅ ¡Excelente! Con esas horas deberías obtener una buena nota.")
            elif prediccion >= 5:
                print("⚠️  Con esas horas podrías aprobar, pero considera estudiar más.")
            else:
                print("❌ Con esas horas podrías tener dificultades. Te recomiendo estudiar más.")
            
            break
            
        except ValueError:
            print("❌ Error: Por favor introduce un número válido.")
        except KeyboardInterrupt:
            print("\n\n👋 ¡Hasta luego!")
            exit()

def guardar_modelo(modelo, nombre_archivo='modelo_notas.pkl'):
    """Guarda el modelo entrenado en un archivo pickle"""
    try:
        with open(nombre_archivo, 'wb') as f:
            pickle.dump(modelo, f)
        print(f"\n💾 Modelo guardado en '{nombre_archivo}'")
    except Exception as e:
        print(f"❌ Error al guardar el modelo: {e}")

def cargar_modelo(nombre_archivo='modelo_notas.pkl'):
    """Carga un modelo previamente guardado"""
    try:
        with open(nombre_archivo, 'rb') as f:
            modelo = pickle.load(f)
        print(f"✅ Modelo cargado desde '{nombre_archivo}'")
        return modelo
    except FileNotFoundError:
        print(f"📝 No se encontró el archivo '{nombre_archivo}'. Se entrenará un nuevo modelo.")
        return None
    except Exception as e:
        print(f"❌ Error al cargar el modelo: {e}")
        return None

def main():
    """Función principal del programa"""
    print("🎓 IA DE PREDICCIÓN DE NOTA A PARTIR DE HORAS DE ESTUDIO")
    print("=" * 60)
    
    # Intentar cargar modelo existente
    modelo = cargar_modelo()
    
    if modelo is None:
        # Crear datos de ejemplo
        print("\n📊 Creando conjunto de datos de ejemplo...")
        df = crear_datos_ejemplo()
        
        print("Datos de entrenamiento:")
        print(df.to_string(index=False))
        
        # Separar variables
        X = df['Horas'].values.reshape(-1, 1)
        y = df['Nota'].values
        
        # Entrenar modelo
        print("\n🤖 Entrenando modelo de regresión lineal...")
        modelo = entrenar_modelo(X, y)
        
        # Mostrar resultados
        m, b, r2 = mostrar_resultados(modelo, X, y)
        
        # Graficar resultados
        print("\n📈 Generando gráfica...")
        graficar_resultados(X, y, modelo, m, b)
        
        # Guardar modelo
        guardar_modelo(modelo)
    
    # Realizar predicciones
    while True:
        predecir_nota(modelo)
        
        continuar = input("\n¿Deseas hacer otra predicción? (s/n): ").lower()
        if continuar not in ['s', 'si', 'sí', 'y', 'yes']:
            print("👋 ¡Gracias por usar la IA de predicción de notas!")
            break

if __name__ == "__main__":
    main() 