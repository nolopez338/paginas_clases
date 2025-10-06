import tkinter as tk

def presionar(boton):
    # Añadir el carácter presionado a la expresión
    expresion.set(expresion.get() + str(boton))

def borrar():
    # Vaciar la pantalla
    expresion.set("")

def calcular():
    try:
        resultado = eval(expresion.get())  # Evalúa la expresión
        expresion.set(str(resultado))
    except:
        expresion.set("Error")

# Crear ventana
ventana = tk.Tk()
ventana.title("Calculadora")
ventana.geometry("300x400")

# Variable que almacena la expresión
expresion = tk.StringVar()

# Campo de texto (pantalla)
pantalla = tk.Entry(ventana, textvariable=expresion, font=("Arial", 20), bd=10, relief="ridge", justify="right")
pantalla.grid(row=0, column=0, columnspan=4, padx=10, pady=10)

# Botones
botones = [
    ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('/', 1, 3),
    ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
    ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('-', 3, 3),
    ('0', 4, 0), ('.', 4, 1), ('%', 4, 2), ('+', 4, 3)
]

for (texto, fila, columna) in botones:
    tk.Button(ventana, text=texto, font=("Arial", 18),
              command=lambda t=texto: presionar(t)).grid(row=fila, column=columna, padx=5, pady=5, sticky="nsew")

# Botón de borrar
tk.Button(ventana, text="C", font=("Arial", 18), command=borrar)\
    .grid(row=5, column=0, columnspan=2, padx=5, pady=5, sticky="nsew")

# Botón de igual
tk.Button(ventana, text="=", font=("Arial", 18), command=calcular)\
    .grid(row=5, column=2, columnspan=2, padx=5, pady=5, sticky="nsew")

# Ajustar tamaño de filas y columnas
for i in range(6):
    ventana.rowconfigure(i, weight=1)
for j in range(4):
    ventana.columnconfigure(j, weight=1)

ventana.mainloop()
