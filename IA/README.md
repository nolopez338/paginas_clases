# 🎓 IA de Predicción de Nota a partir de Horas de Estudio

Este proyecto implementa un modelo de regresión lineal para predecir la nota que un estudiante podría obtener basándose en las horas de estudio dedicadas.

## 📋 Características

- **Modelo de Regresión Lineal**: Utiliza scikit-learn para entrenar un modelo que relaciona horas de estudio con notas
- **Visualización**: Gráfica interactiva con matplotlib que muestra los datos originales y la línea de regresión
- **Predicciones Interactivas**: Permite al usuario introducir horas de estudio y obtener predicciones de notas
- **Persistencia del Modelo**: Guarda y carga el modelo entrenado usando pickle
- **Manejo de Errores**: Validación de entrada y manejo de excepciones
- **Datos Aleatorios**: Opción para generar datos sintéticos para experimentación

## 🚀 Instalación

1. **Clonar o descargar el proyecto**
2. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

## 📊 Uso

### Ejecución básica
```bash
python main.py
```

### Flujo del programa

1. **Carga de datos**: El programa utiliza el conjunto de datos de ejemplo especificado
2. **Entrenamiento**: Se entrena un modelo de regresión lineal
3. **Resultados**: Se muestran en consola:
   - Ecuación de la línea de regresión (y = mx + b)
   - Coeficiente de determinación R²
4. **Visualización**: Se abre una ventana con la gráfica
5. **Predicciones**: El usuario puede introducir horas de estudio para obtener predicciones

## 📈 Datos de Entrenamiento

El conjunto de datos de ejemplo incluye:

| Horas | Nota |
|-------|------|
| 1     | 2.0  |
| 2     | 4.0  |
| 3     | 5.0  |
| 4     | 4.5  |
| 5     | 6.0  |

## 🔧 Estructura del Proyecto

```
IA/
├── main.py              # Script principal
├── requirements.txt     # Dependencias de Python
├── README.md           # Este archivo
└── modelo_notas.pkl    # Modelo guardado (se crea automáticamente)
```

## 📚 Funcionalidades

### Funciones Principales

- `crear_datos_ejemplo()`: Crea el conjunto de datos especificado
- `generar_datos_aleatorios()`: Genera datos sintéticos para experimentación
- `entrenar_modelo()`: Entrena el modelo de regresión lineal
- `mostrar_resultados()`: Muestra ecuación y R² en consola
- `graficar_resultados()`: Crea la visualización con matplotlib
- `predecir_nota()`: Interfaz para predicciones interactivas
- `guardar_modelo()` / `cargar_modelo()`: Persistencia del modelo

### Características Avanzadas

- **Validación de entrada**: Manejo de errores para entradas no numéricas
- **Recomendaciones**: El sistema proporciona consejos basados en la predicción
- **Persistencia**: El modelo se guarda automáticamente y se puede reutilizar
- **Interfaz amigable**: Mensajes claros y emojis para mejor experiencia

## 🎯 Salidas Esperadas

### Consola
```
🎓 IA DE PREDICCIÓN DE NOTA A PARTIR DE HORAS DE ESTUDIO
============================================================

📊 Creando conjunto de datos de ejemplo...
Datos de entrenamiento:
   Horas  Nota
0      1   2.0
1      2   4.0
2      3   5.0
3      4   4.5
4      5   6.0

🤖 Entrenando modelo de regresión lineal...

==================================================
RESULTADOS DEL MODELO DE REGRESIÓN LINEAL
==================================================
Ecuación aproximada: y = 0.950·x + 1.150
Coeficiente de determinación R²: 0.8235
==================================================

📈 Generando gráfica...

💾 Modelo guardado en 'modelo_notas.pkl'

==================================================
PREDICCIÓN DE NOTA
==================================================
Introduce las horas de estudio previstas: 3.5

📚 Horas de estudio: 3.5
📊 Nota predicha: 4.48/10
⚠️  Con esas horas podrías aprobar, pero considera estudiar más.
```

### Gráfica
- Ventana con scatter plot de datos originales
- Línea de regresión superpuesta
- Etiquetas y leyenda informativas

## 🔬 Extensiones Implementadas

1. **Persistencia del Modelo**: Guardado y carga automática
2. **Datos Aleatorios**: Función para generar datos sintéticos
3. **Validación Robusta**: Manejo de errores de entrada
4. **Recomendaciones**: Consejos basados en predicciones
5. **Interfaz Mejorada**: Mensajes claros y emojis

## 🛠️ Requisitos Técnicos

- **Python**: 3.9 o superior
- **Bibliotecas**:
  - scikit-learn (1.3.0)
  - pandas (2.0.3)
  - matplotlib (3.7.2)
  - numpy (1.24.3)

## 📝 Notas Técnicas

- El modelo utiliza `LinearRegression` de scikit-learn
- Los datos se reshapean correctamente para el entrenamiento
- Las predicciones se limitan entre 0 y 10 (escala de notas)
- El coeficiente R² indica la calidad del ajuste (0-1)

## 🎓 Aplicaciones Educativas

Este proyecto es ideal para:
- Aprender regresión lineal
- Entender el proceso de machine learning
- Visualizar relaciones entre variables
- Practicar programación en Python
- Introducir conceptos de IA en el aula

## 🤝 Contribuciones

Las mejoras y extensiones son bienvenidas. Algunas ideas:
- Añadir más algoritmos de regresión
- Implementar validación cruzada
- Crear interfaz web
- Añadir más variables predictoras
- Implementar análisis de residuos

---

**Desarrollado para fines educativos** 🎓 