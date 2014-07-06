//Variables Globales
var renglones = 200;//Renglones de la matriz.
var columnas = 200;//Columnas de la matriz.
var tiempoTicks = 200; //Frecuencia con la que se calcula la vida.
var cantidadGeneraciones = 0;//Contador de las generaciones en cada simulación.
var celulas = [new Array(renglones)];//console.log(celulas);//Contiene la información de cada célula.
var celulasTemp;//Aqui se almacena el estado calculado de cada célula.
var tamCelulas = 4;//Tamaño gráfico de las células. Normalmente es 4
var espacioCelulas = 0;//Espacio gráfico entre cada célula. Funciona bien con 0.6 #experimental
var ctx;//Contexto del objeto canvas.

//Control
$(document).ready(function() {
    var cantidadTotalCelulas = renglones * columnas;
    var cantidadCelulasInicialesVivas = cantidadTotalCelulas * 0.1;//0.5 para grids pequeños. 0.1 está bien para grids grandes.
    //var celula = '{"id":0, "renglon":0, "columna":0, "estado":0}';//Objeto JSON //console.log(celula);
    console.log("Renglones:" + renglones + " Columnas:" + columnas);
    var funcionTiempo;//Contiene el control del tiempo.
    celulas = generarMatrizVida(renglones, columnas);//console.log(celulas);//Se genera la matriz donde se guarda la información de las células.
    celulasTemp = generarMatrizVida(renglones, columnas);//Se genera la matriz en donde se guarda el cálculo de la siguiente generación.
    var c = document.getElementById("mapa");//Se obtiene el mapa donde se despliega la vida.
    c.width = columnas * tamCelulas;// + (espacioCelulas * columnas);//Se calcula el tamaño del mapa en base a la cantidad de células que tiene.
    c.height = renglones * tamCelulas;// + (espacioCelulas * renglones);
    ctx = c.getContext("2d");
    exterminarVida(celulas);//Se reinicia el mapa.
    generarVida(celulas, cantidadCelulasInicialesVivas);//Se genera vida nueva de manera aleatoria.
    recorrerMatriz(celulas, renglones, columnas, pintarCambios);//Se pinta por primera vez el mapa.

    $(".tick").click(function() {
        console.log("Se avanza un tick en el tiempo.");
        hacerTick();
    });

    $(".iniciar").click(function() {
        console.log("El tiempo se echa a andar.");
        window.clearInterval(funcionTiempo);//Se detiene cualquier otro ciclo anterior.
        funcionTiempo = window.setInterval(hacerTick, tiempoTicks);//El tiempo se echa a andar.
    });

    $(".reiniciar").click(function() {
        console.log("Se reinicia la vida en el universo");
        exterminarVida(celulas);
        cantidadGeneraciones = 0;
        $(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones);
        generarVida(celulas, cantidadCelulasInicialesVivas);
        recorrerMatriz(celulas, renglones, columnas, pintarCambios);
    });

    $(".detener").click(function() {
        console.log("Se detiene la simulación");
        window.clearInterval(funcionTiempo);
    });

});