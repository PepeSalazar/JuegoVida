//Variables Globales
var renglones = 200;//Renglones de la matriz.
var columnas = 200;//Columnas de la matriz.
var tamCelulas = 4;//Tamaño gráfico de las células. Normalmente es 4
var espacioCelulas = 0;//Espacio gráfico entre cada célula. Funciona bien con 0.6 #experimental
var porcentajeVida = 0.4;//El porcentaje de vida inicial en el mapa.//0.5 para grids pequeños. 0.1 está bien para grids grandes.
var tiempoTicks = 0; //Frecuencia con la que se calcula la vida. Después de cierto tamaño del mapa, se ignora esto.
var cantidadGeneraciones = 0;//Contador de las generaciones en cada simulación.
var celulas = [new Array(renglones)];//console.log(celulas);//Contiene la información de cada célula.
var celulasTemp;//Aqui se almacena el estado calculado de cada célula.
var ctx;//Contexto del objeto canvas.
var cantidadColonias = 0;//Las colonias que son formadas por células.

//Control
$(document).ready(function() {
    var funcionTiempo;//Contiene el control del tiempo.
    generarUniverso();

    $(".tick").click(function(event) {
        event.preventDefault();
        console.log("Se avanza un tick en el tiempo.");
        hacerTick();
    });

    $(".iniciar").click(function(event) {
        event.preventDefault();
        console.log("El tiempo se echa a andar.");
        window.clearInterval(funcionTiempo);//Se detiene cualquier otro ciclo anterior.
        funcionTiempo = window.setInterval(hacerTick, tiempoTicks);//El tiempo se echa a andar.
    });

    $(".detener").click(function(event) {
        event.preventDefault();
        console.log("Se detiene la simulación");
        window.clearInterval(funcionTiempo);
    });
    
    $(".reiniciar").click(function(event) {
        event.preventDefault();
        console.log("Se reinicia la vida en el universo");
        generarUniverso();
    });
});