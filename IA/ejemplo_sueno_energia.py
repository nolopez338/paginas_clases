import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

def crear_datos_sueno_energia():
    """Crea datos de ejemplo para horas de sueño vs energía diaria"""
    datos = {
        'Horas_Sueno': [5, 6, 7, 8, 9, 10],
        'Energia_Diaria': [3.0, 4.5, 6.0, 7.5, 8.0, 7.0]  # Escala 0-10
    }
    return pd.DataFrame(datos)

def generar_datos_sueno_aleatorios(n_muestras=30):
    """Genera datos aleatorios para experimentar con sueño vs energía"""
    np.random.seed(42)
    horas_sueno = np.random.uniform(4.0, 12.0, n_muestras)
    
    # Simula relación: más sueño = más energía (hasta cierto punto)
    # Después de 9 horas, la energía puede disminuir ligeramente
    energia_base = 0.8 * horas_sueno + 1.0
    # Añadir efecto de "demasiado sueño" después de 9 horas
    efecto_exceso = np.where(horas_sueno > 9, -0.3 * (horas_sueno - 9), 0)
    energia = energia_base + efecto_exceso + np.random.normal(0, 0.8, n_muestras)
    energia = np.clip(energia, 0, 10)
    
    datos = {
        'Horas_Sueno': horas_sueno,
        'Energia_Diaria': energia
    }
    return pd.DataFrame(datos)

def entrenar_modelo_sueno(X, y):
    """Entrena el modelo de regresión lineal para sueño vs energía"""
    modelo = LinearRegression()
    modelo.fit(X, y)
    return modelo

def mostrar_resultados_sueno(modelo, X, y):
    """Muestra los resultados del modelo de sueño vs energía"""
    m = modelo.coef_[0]
    b = modelo.intercept_
    
    y_pred = modelo.predict(X)
    r2 = r2_score(y, y_pred)
    
    print("=" * 60)
    print("RESULTADOS: HORAS DE SUEÑO vs ENERGÍA DIARIA")
    print("=" * 60)
    print(f"Ecuación: Energía = {m:.3f} × Horas_Sueño + {b:.3f}")
    print(f"Coeficiente R²: {r2:.4f}")
    print("=" * 60)
    
    return m, b, r2

def graficar_sueno_energia(X, y, modelo, m, b):
    """Crea gráfica para sueño vs energía"""
    plt.figure(figsize=(12, 8))
    
    # Gráfica principal
    plt.subplot(2, 2, 1)
    plt.scatter(X, y, color='purple', s=100, alpha=0.7, label='Datos originales')
    
    X_line = np.linspace(X.min() - 0.5, X.max() + 0.5, 100)
    y_line = m * X_line + b
    plt.plot(X_line, y_line, color='orange', linewidth=2, label=f'Energía = {m:.3f}×Sueño + {b:.3f}')
    
    plt.xlabel('Horas de Sueño', fontsize=12)
    plt.ylabel('Energía Diaria (0-10)', fontsize=12)
    plt.title('Relación: Sueño vs Energía Diaria', fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.xlim(4, 12)
    plt.ylim(0, 10)
    
    # Gráfica de distribución de horas de sueño
    plt.subplot(2, 2, 2)
    plt.hist(X, bins=10, color='lightblue', alpha=0.7, edgecolor='black')
    plt.xlabel('Horas de Sueño')
    plt.ylabel('Frecuencia')
    plt.title('Distribución de Horas de Sueño')
    plt.grid(True, alpha=0.3)
    
    # Gráfica de distribución de energía
    plt.subplot(2, 2, 3)
    plt.hist(y, bins=10, color='lightgreen', alpha=0.7, edgecolor='black')
    plt.xlabel('Energía Diaria')
    plt.ylabel('Frecuencia')
    plt.title('Distribución de Energía Diaria')
    plt.grid(True, alpha=0.3)
    
    # Gráfica de residuos
    plt.subplot(2, 2, 4)
    y_pred = modelo.predict(X)
    residuos = y - y_pred
    plt.scatter(y_pred, residuos, color='red', alpha=0.7)
    plt.axhline(y=0, color='black', linestyle='--', alpha=0.5)
    plt.xlabel('Energía Predicha')
    plt.ylabel('Residuos')
    plt.title('Análisis de Residuos')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()

def predecir_energia(modelo):
    """Predice energía basada en horas de sueño"""
    while True:
        try:
            print("\n" + "=" * 50)
            print("PREDICCIÓN DE ENERGÍA DIARIA")
            print("=" * 50)
            horas_sueno = float(input("Introduce las horas de sueño: "))
            
            if horas_sueno < 0 or horas_sueno > 24:
                print("❌ Error: Las horas de sueño deben estar entre 0 y 24.")
                continue
                
            prediccion = modelo.predict([[horas_sueno]])[0]
            prediccion = np.clip(prediccion, 0, 10)
            
            print(f"\n😴 Horas de sueño: {horas_sueno}")
            print(f"⚡ Energía predicha: {prediccion:.2f}/10")
            
            # Recomendaciones
            if horas_sueno < 6:
                print("⚠️  Poco sueño detectado. Considera dormir más para mejorar tu energía.")
            elif horas_sueno > 10:
                print("😴 Muchas horas de sueño. Podrías sentirte somnoliento durante el día.")
            else:
                print("✅ Horas de sueño saludables. ¡Mantén esta rutina!")
            
            if prediccion >= 7:
                print("🚀 ¡Excelente nivel de energía! Tendrás un día productivo.")
            elif prediccion >= 5:
                print("👍 Energía moderada. Considera una siesta corta si es necesario.")
            else:
                print("😴 Baja energía. Prioriza el descanso y la hidratación.")
            
            break
            
        except ValueError:
            print("❌ Error: Por favor introduce un número válido.")
        except KeyboardInterrupt:
            print("\n\n👋 ¡Hasta luego!")
            exit()

def analizar_patrones_sueno(df):
    """Analiza patrones en los datos de sueño"""
    print("\n📊 ANÁLISIS DE PATRONES DE SUEÑO")
    print("=" * 40)
    
    print(f"Promedio de horas de sueño: {df['Horas_Sueno'].mean():.2f}")
    print(f"Desviación estándar: {df['Horas_Sueno'].std():.2f}")
    print(f"Horas mínimas: {df['Horas_Sueno'].min():.1f}")
    print(f"Horas máximas: {df['Horas_Sueno'].max():.1f}")
    
    print(f"\nPromedio de energía: {df['Energia_Diaria'].mean():.2f}")
    print(f"Energía máxima registrada: {df['Energia_Diaria'].max():.1f}")
    print(f"Energía mínima registrada: {df['Energia_Diaria'].min():.1f}")
    
    # Encontrar mejor combinación
    mejor_idx = df['Energia_Diaria'].idxmax()
    mejor_sueno = df.loc[mejor_idx, 'Horas_Sueno']
    mejor_energia = df.loc[mejor_idx, 'Energia_Diaria']
    
    print(f"\n🏆 Mejor combinación:")
    print(f"   {mejor_sueno:.1f} horas de sueño → {mejor_energia:.1f} de energía")

def main():
    """Función principal para el ejemplo de sueño vs energía"""
    print("😴 ENERGÍA DIARIA vs HORAS DE SUEÑO")
    print("=" * 60)
    
    # Crear datos
    print("\n📊 Creando datos de ejemplo...")
    df = crear_datos_sueno_energia()
    
    print("Datos de entrenamiento:")
    print(df.to_string(index=False))
    
    # Separar variables
    X = df['Horas_Sueno'].values.reshape(-1, 1)
    y = df['Energia_Diaria'].values
    
    # Entrenar modelo
    print("\n🤖 Entrenando modelo...")
    modelo = entrenar_modelo_sueno(X, y)
    
    # Mostrar resultados
    m, b, r2 = mostrar_resultados_sueno(modelo, X, y)
    
    # Analizar patrones
    analizar_patrones_sueno(df)
    
    # Graficar
    print("\n📈 Generando gráficas...")
    graficar_sueno_energia(X, y, modelo, m, b)
    
    # Predicciones
    while True:
        predecir_energia(modelo)
        
        continuar = input("\n¿Otra predicción? (s/n): ").lower()
        if continuar not in ['s', 'si', 'sí', 'y', 'yes']:
            print("😴 ¡Descansa bien!")
            break

if __name__ == "__main__":
    main() 