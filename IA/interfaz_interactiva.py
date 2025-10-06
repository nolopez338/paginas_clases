import tkinter as tk
from tkinter import ttk, messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
from matplotlib.patches import Circle
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import matplotlib.patches as mpatches

class InterfazInteractiva:
    def __init__(self, root):
        self.root = root
        self.root.title("🎓 IA Interactiva - Predicción de Notas")
        self.root.geometry("1200x800")
        
        # Datos iniciales
        self.datos_iniciales = {
            'Horas': [1, 2, 3, 4, 5],
            'Nota': [2.0, 4.0, 5.0, 4.5, 6.0]
        }
        self.df = pd.DataFrame(self.datos_iniciales)
        
        # Variables de control
        self.modo_arrastre = False
        self.punto_seleccionado = None
        self.puntos_artistas = []
        self.prediccion_actual = None
        self.marcador_prediccion = None
        self.usar_sklearn = False  # Por defecto usar método manual
        
        # Configurar la interfaz
        self.configurar_interfaz()
        self.crear_grafica()
        self.conectar_eventos()
        self.actualizar_modelo()
        
    def configurar_interfaz(self):
        """Configura la interfaz principal"""
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky="nsew")
        
        # Configurar grid
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(1, weight=1)
        
        # Panel de control izquierdo
        control_frame = ttk.LabelFrame(main_frame, text="Controles", padding="10")
        control_frame.grid(row=0, column=0, rowspan=2, sticky="nsew", padx=(0, 10))
        
        # Título
        titulo = ttk.Label(control_frame, text="🎓 IA de Predicción", font=("Arial", 14, "bold"))
        titulo.grid(row=0, column=0, pady=(0, 20))
        
        # Información del modelo
        self.info_modelo = ttk.Label(control_frame, text="", font=("Arial", 10))
        self.info_modelo.grid(row=1, column=0, pady=(0, 20))
        
        # Estadísticas
        stats_frame = ttk.LabelFrame(control_frame, text="Estadísticas", padding="5")
        stats_frame.grid(row=2, column=0, sticky="ew", pady=(0, 20))
        
        self.stats_text = tk.Text(stats_frame, height=8, width=30, font=("Consolas", 9))
        self.stats_text.grid(row=0, column=0, sticky=(tk.W, tk.E))
        
        # Selector de método de entrenamiento
        metodo_frame = ttk.LabelFrame(control_frame, text="Método de Entrenamiento", padding="5")
        metodo_frame.grid(row=3, column=0, sticky="ew", pady=(0, 20))
        
        self.metodo_var = tk.StringVar(value="manual")
        ttk.Radiobutton(metodo_frame, text="🧮 Manual (solo numpy)", 
                       variable=self.metodo_var, value="manual",
                       command=self.cambiar_metodo).grid(row=0, column=0, sticky="w", pady=2)
        ttk.Radiobutton(metodo_frame, text="🤖 Scikit-learn", 
                       variable=self.metodo_var, value="sklearn",
                       command=self.cambiar_metodo).grid(row=1, column=0, sticky="w", pady=2)
        
        # Botones de control
        btn_frame = ttk.Frame(control_frame)
        btn_frame.grid(row=4, column=0, sticky="ew", pady=(0, 20))
        
        ttk.Button(btn_frame, text="🔄 Reiniciar Datos", command=self.reiniciar_datos).grid(row=0, column=0, pady=5)
        ttk.Button(btn_frame, text="📊 Generar Aleatorios", command=self.generar_datos_aleatorios).grid(row=1, column=0, pady=5)
        ttk.Button(btn_frame, text="💾 Guardar Modelo", command=self.guardar_modelo).grid(row=2, column=0, pady=5)
        ttk.Button(btn_frame, text="📈 Predicción", command=self.mostrar_prediccion).grid(row=3, column=0, pady=5)
        
        # Panel de predicción con slider
        pred_frame = ttk.LabelFrame(control_frame, text="Predicción Interactiva", padding="5")
        pred_frame.grid(row=5, column=0, sticky="ew")
        
        # Slider para horas de estudio
        ttk.Label(pred_frame, text="Horas de estudio:", font=("Arial", 10, "bold")).grid(row=0, column=0, columnspan=2, sticky=tk.W, pady=(0, 5))
        
        # Frame para el slider y valor
        slider_frame = ttk.Frame(pred_frame)
        slider_frame.grid(row=1, column=0, columnspan=2, sticky="ew", pady=(0, 5))
        
        self.slider_horas = ttk.Scale(slider_frame, from_=0, to=10, orient="horizontal", 
                                     command=self.on_slider_change, length=200)
        self.slider_horas.set(3.5)
        self.slider_horas.grid(row=0, column=0, sticky="ew")
        
        self.valor_slider = ttk.Label(slider_frame, text="3.5", font=("Arial", 10, "bold"), width=5)
        self.valor_slider.grid(row=0, column=1, padx=(10, 0))
        
        # Entrada manual (opcional)
        ttk.Label(pred_frame, text="O entrada manual:").grid(row=2, column=0, sticky=tk.W, pady=(5, 0))
        self.entrada_horas = ttk.Entry(pred_frame, width=10)
        self.entrada_horas.grid(row=2, column=1, padx=(5, 0), pady=(5, 0))
        self.entrada_horas.insert(0, "3.5")
        self.entrada_horas.bind('<KeyRelease>', self.on_entrada_change)
        
        ttk.Button(pred_frame, text="Predecir", command=self.hacer_prediccion).grid(row=3, column=0, columnspan=2, pady=(5, 0))
        
        self.resultado_prediccion = ttk.Label(pred_frame, text="", font=("Arial", 10, "bold"))
        self.resultado_prediccion.grid(row=4, column=0, columnspan=2, pady=(5, 0))
        
        # Panel de gráfica
        grafica_frame = ttk.LabelFrame(main_frame, text="Gráfica Interactiva", padding="10")
        grafica_frame.grid(row=0, column=1, rowspan=2, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Crear figura matplotlib
        self.fig, self.ax = plt.subplots(figsize=(10, 6))
        self.canvas = FigureCanvasTkAgg(self.fig, grafica_frame)
        self.canvas.draw()
        self.canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)
        
        # Barra de herramientas
        toolbar = NavigationToolbar2Tk(self.canvas, grafica_frame)
        toolbar.update()
        toolbar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Instrucciones
        instrucciones = ttk.Label(main_frame, text="💡 Haz clic para añadir puntos • Arrastra puntos para moverlos • La línea se actualiza automáticamente", 
                                 font=("Arial", 9), foreground="gray")
        instrucciones.grid(row=2, column=0, columnspan=2, pady=(10, 0))
        
    def crear_grafica(self):
        """Crea la gráfica inicial"""
        self.ax.clear()
        self.ax.set_xlabel('Horas de Estudio', fontsize=12)
        self.ax.set_ylabel('Nota Obtenida', fontsize=12)
        self.ax.set_title('Predicción de Nota vs Horas de Estudio', fontsize=14, fontweight='bold')
        self.ax.grid(True, alpha=0.3)
        self.ax.set_xlim(0, 10)
        self.ax.set_ylim(0, 10)
        
        # Dibujar puntos iniciales
        self.dibujar_puntos()
        
        self.canvas.draw()
        
    def dibujar_puntos(self):
        """Dibuja los puntos en la gráfica"""
        # Limpiar puntos anteriores
        for artista in self.puntos_artistas:
            artista.remove()
        self.puntos_artistas.clear()
        
        # Dibujar nuevos puntos
        for i, (hora, nota) in enumerate(zip(self.df['Horas'], self.df['Nota'])):
            punto = Circle((hora, nota), 0.2, color='blue', alpha=0.7, picker=5)
            self.ax.add_patch(punto)
            self.puntos_artistas.append(punto)
            
    def conectar_eventos(self):
        """Conecta los eventos del mouse"""
        self.canvas.mpl_connect('button_press_event', self.on_click)
        self.canvas.mpl_connect('motion_notify_event', self.on_motion)
        self.canvas.mpl_connect('button_release_event', self.on_release)
        
    def cambiar_metodo(self):
        """Cambia entre método manual y sklearn"""
        self.usar_sklearn = (self.metodo_var.get() == "sklearn")
        self.actualizar_modelo()
        
    def entrenar_modelo_manual(self, X, y):
        """Entrena el modelo de regresión lineal manualmente usando solo numpy"""
        # Convertir a arrays numpy
        X = np.array(X).flatten()
        y = np.array(y)
        
        # Calcular medias
        x_mean = np.mean(X)
        y_mean = np.mean(y)
        
        # Calcular pendiente (m) usando la fórmula: m = Σ((x-x_mean)(y-y_mean)) / Σ((x-x_mean)²)
        numerador = np.sum((X - x_mean) * (y - y_mean))
        denominador = np.sum((X - x_mean) ** 2)
        
        # Evitar división por cero
        if denominador == 0:
            m = 0
        else:
            m = numerador / denominador
        
        # Calcular intercepto (b) usando la fórmula: b = y_mean - m * x_mean
        b = y_mean - m * x_mean
        
        # Crear objeto similar a sklearn para compatibilidad
        class ModeloManual:
            def __init__(self, coef, intercept):
                self.coef_ = np.array([coef])
                self.intercept_ = intercept
                
            def predict(self, X):
                return self.coef_[0] * X + self.intercept_
                
        return ModeloManual(m, b)
        
    def calcular_r2_manual(self, y_true, y_pred):
        """Calcula R² manualmente"""
        # R² = 1 - (SS_res / SS_tot)
        # SS_res = Σ(y_true - y_pred)²
        # SS_tot = Σ(y_true - y_mean)²
        
        y_mean = np.mean(y_true)
        ss_res = np.sum((y_true - y_pred) ** 2)
        ss_tot = np.sum((y_true - y_mean) ** 2)
        
        if ss_tot == 0:
            return 1.0  # Si no hay variación, R² = 1
            
        return 1 - (ss_res / ss_tot)
        
    def on_click(self, event):
        """Maneja el evento de clic del mouse"""
        if event.inaxes != self.ax:
            return
            
        # Verificar si se hizo clic en un punto existente
        for i, punto in enumerate(self.puntos_artistas):
            if punto.contains(event)[0]:
                self.modo_arrastre = True
                self.punto_seleccionado = i
                return
                
        # Si no se hizo clic en un punto, crear uno nuevo
        if event.button == 1:  # Clic izquierdo
            hora = event.xdata
            nota = event.ydata
            
            # Validar coordenadas
            if hora is None or nota is None or hora < 0 or nota < 0:
                return
                
            # Añadir nuevo punto al DataFrame
            nuevo_punto = pd.DataFrame({'Horas': [hora], 'Nota': [nota]})
            self.df = pd.concat([self.df, nuevo_punto], ignore_index=True)
            
            # Redibujar y actualizar modelo
            self.dibujar_puntos()
            self.actualizar_modelo()
            self.canvas.draw()
            
    def on_motion(self, event):
        """Maneja el evento de movimiento del mouse"""
        if not self.modo_arrastre or self.punto_seleccionado is None:
            return
            
        if event.inaxes != self.ax:
            return
            
        # Actualizar coordenadas del punto
        hora = event.xdata
        nota = event.ydata
        
        if hora is not None and nota is not None:
            # Limitar coordenadas
            hora = max(0, min(10, hora))
            nota = max(0, min(10, nota))
            
            # Actualizar DataFrame
            self.df.loc[self.punto_seleccionado, 'Horas'] = hora
            self.df.loc[self.punto_seleccionado, 'Nota'] = nota
            
            # Actualizar posición del punto
            self.puntos_artistas[self.punto_seleccionado].center = (hora, nota)
            
            # Actualizar modelo en tiempo real
            self.actualizar_modelo()
            self.canvas.draw()
            
    def on_release(self, event):
        """Maneja el evento de liberación del mouse"""
        if self.modo_arrastre:
            self.modo_arrastre = False
            self.punto_seleccionado = None
            
    def actualizar_modelo(self):
        """Actualiza el modelo de regresión lineal"""
        if len(self.df) < 2:
            return
            
        # Preparar datos
        X = self.df['Horas'].values.reshape(-1, 1)
        y = self.df['Nota'].values
        
        # Entrenar modelo según el método seleccionado
        if self.usar_sklearn:
            # Usar scikit-learn
            modelo = LinearRegression()
            modelo.fit(X, y)
            m = modelo.coef_[0]
            b = modelo.intercept_
            y_pred = modelo.predict(X)
            r2 = r2_score(y, y_pred)
        else:
            # Usar método manual
            modelo = self.entrenar_modelo_manual(X, y)
            m = modelo.coef_[0]
            b = modelo.intercept_
            y_pred = modelo.predict(X.flatten())
            r2 = self.calcular_r2_manual(y, y_pred)
        
        # Actualizar línea de regresión
        self.actualizar_linea_regresion(m, b)
        
        # Actualizar información en la interfaz
        metodo_texto = "🤖 sklearn" if self.usar_sklearn else "🧮 Manual"
        self.info_modelo.config(text=f"{metodo_texto}\ny = {m:.3f}x + {b:.3f}\nR² = {r2:.4f}")
        
        # Actualizar estadísticas
        self.actualizar_estadisticas()
        
        # Actualizar predicción si hay un valor en el slider
        try:
            horas_actuales = float(self.slider_horas.get())
            self.actualizar_prediccion_en_grafica(horas_actuales)
        except:
            pass
        
    def actualizar_linea_regresion(self, m, b):
        """Actualiza la línea de regresión en la gráfica"""
        # Limpiar línea anterior
        for linea in self.ax.lines:
            linea.remove()
            
        # Dibujar nueva línea
        x_min, x_max = self.ax.get_xlim()
        x_line = np.linspace(x_min, x_max, 100)
        y_line = m * x_line + b
        
        self.ax.plot(x_line, y_line, color='red', linewidth=2, 
                    label=f'y = {m:.3f}x + {b:.3f}')
        
        # Actualizar leyenda
        if self.ax.get_legend():
            self.ax.get_legend().remove()
        self.ax.legend()
        
    def actualizar_estadisticas(self):
        """Actualiza las estadísticas mostradas"""
        stats_text = f"""📊 ESTADÍSTICAS

Puntos de datos: {len(self.df)}
Horas promedio: {self.df['Horas'].mean():.2f}
Nota promedio: {self.df['Nota'].mean():.2f}

Horas (min/max): {self.df['Horas'].min():.1f} / {self.df['Horas'].max():.1f}
Nota (min/max): {self.df['Nota'].min():.1f} / {self.df['Nota'].max():.1f}

Desv. estándar horas: {self.df['Horas'].std():.2f}
Desv. estándar notas: {self.df['Nota'].std():.2f}"""
        
        self.stats_text.delete(1.0, tk.END)
        self.stats_text.insert(1.0, stats_text)
        
    def reiniciar_datos(self):
        """Reinicia los datos a los valores iniciales"""
        self.df = pd.DataFrame(self.datos_iniciales)
        self.crear_grafica()
        self.actualizar_modelo()
        
    def generar_datos_aleatorios(self):
        """Genera datos aleatorios para experimentar"""
        np.random.seed(42)
        n_puntos = np.random.randint(8, 15)
        
        horas = np.random.uniform(1, 8, n_puntos)
        notas = 0.8 * horas + 1.5 + np.random.normal(0, 0.8, n_puntos)
        notas = np.clip(notas, 0, 10)
        
        self.df = pd.DataFrame({
            'Horas': horas,
            'Nota': notas
        })
        
        self.crear_grafica()
        self.actualizar_modelo()
        
    def guardar_modelo(self):
        """Guarda el modelo actual"""
        try:
            import pickle
            X = self.df['Horas'].values.reshape(-1, 1)
            y = self.df['Nota'].values
            
            modelo = LinearRegression()
            modelo.fit(X, y)
            
            with open('modelo_interactivo.pkl', 'wb') as f:
                pickle.dump(modelo, f)
                
            messagebox.showinfo("Éxito", "Modelo guardado como 'modelo_interactivo.pkl'")
        except Exception as e:
            messagebox.showerror("Error", f"Error al guardar: {e}")
            
    def mostrar_prediccion(self):
        """Muestra una ventana de predicción"""
        ventana_pred = tk.Toplevel(self.root)
        ventana_pred.title("Predicción de Nota")
        ventana_pred.geometry("400x300")
        
        ttk.Label(ventana_pred, text="Introduce las horas de estudio:", font=("Arial", 12)).pack(pady=20)
        
        entrada = ttk.Entry(ventana_pred, font=("Arial", 14), width=10)
        entrada.pack(pady=10)
        entrada.focus()
        
        resultado = ttk.Label(ventana_pred, text="", font=("Arial", 14, "bold"))
        resultado.pack(pady=20)
        
        def predecir():
            try:
                horas = float(entrada.get())
                if horas < 0:
                    resultado.config(text="❌ Horas no pueden ser negativas")
                    return
                    
                X = self.df['Horas'].values.reshape(-1, 1)
                y = self.df['Nota'].values
                
                modelo = LinearRegression()
                modelo.fit(X, y)
                
                prediccion = modelo.predict([[horas]])[0]
                prediccion = np.clip(prediccion, 0, 10)
                
                resultado.config(text=f"📚 {horas} horas → {prediccion:.2f}/10")
                
            except ValueError:
                resultado.config(text="❌ Introduce un número válido")
                
        ttk.Button(ventana_pred, text="Predecir", command=predecir).pack(pady=10)
        
        # Enter para predecir
        entrada.bind('<Return>', lambda e: predecir())
        
    def on_slider_change(self, value):
        """Maneja el cambio del slider"""
        try:
            horas = float(value)
            self.valor_slider.config(text=f"{horas:.1f}")
            self.entrada_horas.delete(0, tk.END)
            self.entrada_horas.insert(0, f"{horas:.1f}")
            self.actualizar_prediccion_en_grafica(horas)
        except ValueError:
            pass
            
    def on_entrada_change(self, event=None):
        """Maneja el cambio en la entrada manual"""
        try:
            horas = float(self.entrada_horas.get())
            if 0 <= horas <= 10:
                self.slider_horas.set(horas)
                self.valor_slider.config(text=f"{horas:.1f}")
                self.actualizar_prediccion_en_grafica(horas)
        except ValueError:
            pass
            
    def actualizar_prediccion_en_grafica(self, horas):
        """Actualiza la predicción mostrada en la gráfica"""
        if len(self.df) < 2:
            return
            
        try:
            # Entrenar modelo según el método seleccionado
            X = self.df['Horas'].values.reshape(-1, 1)
            y = self.df['Nota'].values
            
            if self.usar_sklearn:
                modelo = LinearRegression()
                modelo.fit(X, y)
                prediccion = modelo.predict([[horas]])[0]
            else:
                modelo = self.entrenar_modelo_manual(X, y)
                prediccion = modelo.predict(horas)
                
            prediccion = np.clip(prediccion, 0, 10)
            
            # Mostrar marcador en la gráfica
            self.mostrar_marcador_prediccion(horas, prediccion)
            
            # Actualizar resultado
            self.actualizar_resultado_prediccion(horas, prediccion)
            
        except Exception as e:
            print(f"Error en predicción: {e}")
            
    def mostrar_marcador_prediccion(self, horas, prediccion):
        """Muestra un marcador X rojo en la gráfica para la predicción"""
        # Limpiar marcador anterior
        if self.marcador_prediccion:
            self.marcador_prediccion.remove()
            self.marcador_prediccion = None
            
        # Crear nuevo marcador X rojo
        self.marcador_prediccion = self.ax.scatter(horas, prediccion, 
                                                 color='red', s=200, marker='x', 
                                                 linewidth=3, zorder=10,
                                                 label=f'Predicción: {prediccion:.2f}')
        
        # Actualizar leyenda
        if self.ax.get_legend():
            self.ax.get_legend().remove()
        self.ax.legend()
        
        self.canvas.draw()
        
    def actualizar_resultado_prediccion(self, horas, prediccion):
        """Actualiza el resultado de la predicción en la interfaz"""
        # Dar recomendación
        if prediccion >= 7:
            recomendacion = "✅ ¡Excelente! Con esas horas deberías obtener una buena nota."
        elif prediccion >= 5:
            recomendacion = "⚠️ Con esas horas podrías aprobar, pero considera estudiar más."
        else:
            recomendacion = "❌ Con esas horas podrías tener dificultades. Te recomiendo estudiar más."
            
        self.resultado_prediccion.config(
            text=f"📚 {horas:.1f} horas → {prediccion:.2f}/10\n{recomendacion}"
        )
        
    def hacer_prediccion(self):
        """Hace una predicción con los datos de entrada"""
        try:
            horas = float(self.entrada_horas.get())
            if horas < 0:
                self.resultado_prediccion.config(text="❌ Horas no pueden ser negativas")
                return
                
            self.actualizar_prediccion_en_grafica(horas)
            
        except ValueError:
            self.resultado_prediccion.config(text="❌ Introduce un número válido")

def main():
    """Función principal"""
    root = tk.Tk()
    app = InterfazInteractiva(root)
    root.mainloop()

if __name__ == "__main__":
    main() 