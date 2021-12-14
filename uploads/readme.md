#Archivo para que git no ignore esta carpeta

Nosotros no podemos usar el filesystem para guardar archivos ya
que Heroku va a borrarlos porque los estaríamos guardando en su
filesystem y solo dejaría nuestra app con el código de git.
(Funciona también para optimizar el performance y asegurar
que nuestra app no tenga cosas grabadas que no querramos).