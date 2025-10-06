import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from main import entrenar_modelo, mostrar_resultados, graficar_resultados

def experimentar_con_datos_aleatorios():
    """Script para experimentar con diferentes tamaños de muestra"""
    print("🔬 EXPERIMENTO CON DATOS ALEATORIOS")
    print("=" * 50)
    
    # Diferentes tamaños de muestra para experimentar
    tamanos_muestra = [5, 10, 20, 50, 100]
    
    resultados = []
    
    for n in tamanos_muestra:
        print(f"\n📊 Generando {n} muestras aleatorias...")
        
        # Generar datos aleatorios
        np.random.seed(42)  # Para reproducibilidad
        horas = np.random.uniform(0.5, 8.0, n)
        notas = 0.8 * horas + 1.5 + np.random.normal(0, 0.5, n)
        notas = np.clip(notas, 0, 10)
        
        # Crear DataFrame
        df = pd.DataFrame({'Horas': horas, 'Nota': notas})
        
        # Separar variables
        X = df['Horas'].values.reshape(-1, 1)
        y = df['Nota'].values
        
        # Entrenar modelo
        modelo = entrenar_modelo(X, y)
        
        # Calcular métricas
        m = modelo.coef_[0]
        b = modelo.intercept_
        y_pred = modelo.predict(X)
        r2 = r2_score(y, y_pred)
        
        resultados.append({
            'n_muestras': n,
            'pendiente': m,
            'intercepto': b,
            'r2': r2
        })
        
        print(f"   Pendiente: {m:.3f}")
        print(f"   Intercepto: {b:.3f}")
        print(f"   R²: {r2:.4f}")
    
    # Mostrar resumen
    print("\n" + "=" * 50)
    print("RESUMEN DE RESULTADOS")
    print("=" * 50)
    
    df_resultados = pd.DataFrame(resultados)
    print(df_resultados.to_string(index=False))
    
    # Graficar evolución del R²
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(df_resultados['n_muestras'], df_resultados['r2'], 'bo-', linewidth=2, markersize=8)
    plt.xlabel('Tamaño de Muestra')
    plt.ylabel('Coeficiente R²')
    plt.title('Evolución del R² con el Tamaño de Muestra')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(1, 2, 2)
    plt.plot(df_resultados['n_muestras'], df_resultados['pendiente'], 'ro-', linewidth=2, markersize=8)
    plt.xlabel('Tamaño de Muestra')
    plt.ylabel('Pendiente (m)')
    plt.title('Evolución de la Pendiente con el Tamaño de Muestra')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
    
    return df_resultados

def comparar_modelos():
    """Compara el modelo con datos de ejemplo vs datos aleatorios"""
    print("\n🔄 COMPARACIÓN DE MODELOS")
    print("=" * 50)
    
    # Modelo con datos de ejemplo
    from main import crear_datos_ejemplo
    df_ejemplo = crear_datos_ejemplo()
    X_ej = df_ejemplo['Horas'].values.reshape(-1, 1)
    y_ej = df_ejemplo['Nota'].values
    
    modelo_ejemplo = entrenar_modelo(X_ej, y_ej)
    m_ej = modelo_ejemplo.coef_[0]
    b_ej = modelo_ejemplo.intercept_
    r2_ej = r2_score(y_ej, modelo_ejemplo.predict(X_ej))
    
    # Modelo con datos aleatorios
    df_aleatorio = pd.DataFrame({
        'Horas': np.random.uniform(0.5, 8.0, 20),
        'Nota': np.random.uniform(2.0, 8.0, 20)
    })
    X_al = df_aleatorio['Horas'].values.reshape(-1, 1)
    y_al = df_aleatorio['Nota'].values
    
    modelo_aleatorio = entrenar_modelo(X_al, y_al)
    m_al = modelo_aleatorio.coef_[0]
    b_al = modelo_aleatorio.intercept_
    r2_al = r2_score(y_al, modelo_aleatorio.predict(X_al))
    
    # Mostrar comparación
    print("Datos de Ejemplo:")
    print(f"  Ecuación: y = {m_ej:.3f}x + {b_ej:.3f}")
    print(f"  R²: {r2_ej:.4f}")
    print(f"  Muestras: {len(df_ejemplo)}")
    
    print("\nDatos Aleatorios:")
    print(f"  Ecuación: y = {m_al:.3f}x + {b_al:.3f}")
    print(f"  R²: {r2_al:.4f}")
    print(f"  Muestras: {len(df_aleatorio)}")
    
    # Graficar comparación
    plt.figure(figsize=(12, 5))
    
    # Datos de ejemplo
    plt.subplot(1, 2, 1)
    plt.scatter(X_ej, y_ej, color='blue', s=100, alpha=0.7, label='Datos originales')
    X_line_ej = np.linspace(X_ej.min() - 0.5, X_ej.max() + 0.5, 100)
    y_line_ej = m_ej * X_line_ej + b_ej
    plt.plot(X_line_ej, y_line_ej, color='red', linewidth=2, label=f'y = {m_ej:.3f}x + {b_ej:.3f}')
    plt.xlabel('Horas de Estudio')
    plt.ylabel('Nota Obtenida')
    plt.title('Modelo con Datos de Ejemplo')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Datos aleatorios
    plt.subplot(1, 2, 2)
    plt.scatter(X_al, y_al, color='green', s=100, alpha=0.7, label='Datos aleatorios')
    X_line_al = np.linspace(X_al.min() - 0.5, X_al.max() + 0.5, 100)
    y_line_al = m_al * X_line_al + b_al
    plt.plot(X_line_al, y_line_al, color='orange', linewidth=2, label=f'y = {m_al:.3f}x + {b_al:.3f}')
    plt.xlabel('Horas de Estudio')
    plt.ylabel('Nota Obtenida')
    plt.title('Modelo con Datos Aleatorios')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()

def main():
    """Función principal para experimentos"""
    print("🧪 EXPERIMENTOS CON DATOS ALEATORIOS")
    print("=" * 60)
    
    while True:
        print("\nOpciones disponibles:")
        print("1. Experimentar con diferentes tamaños de muestra")
        print("2. Comparar modelo de ejemplo vs datos aleatorios")
        print("3. Salir")
        
        try:
            opcion = input("\nSelecciona una opción (1-3): ").strip()
            
            if opcion == "1":
                experimentar_con_datos_aleatorios()
            elif opcion == "2":
                comparar_modelos()
            elif opcion == "3":
                print("👋 ¡Hasta luego!")
                break
            else:
                print("❌ Opción no válida. Por favor selecciona 1, 2 o 3.")
                
        except KeyboardInterrupt:
            print("\n\n👋 ¡Hasta luego!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 