//Variables Globales
var renglones = 200;
var columnas = 200;
var tiempoTicks = 200; //Milisegundos
var cantidadGeneraciones = 0;
var celulas = [new Array(renglones)];//console.log(celulas);
var celulasTemp;
var tamCelulas = 4;//Normalmente es 4
var espacioCelulas = 0;//Regularmente es 0.6
var ctx;

//Control
$(document).ready(function() {
    var cont = 0;//Se limpian los contadores.
    var cont2 = 0;
    var identificador = 0;
    var cantidadTotalCelulas = renglones * columnas;
    var cantidadCelulasInicialesVivas = cantidadTotalCelulas * 0.1;//0.5 para grids pequeños. 0.07 está bien para grids grandes.
    var celula = '{"id":0, "renglon":0, "columna":0, "estado":0}';//Objeto JSON //console.log(celula);
    console.log("Renglones:" + renglones + " Columnas:" + columnas);
    var funcionTiempo;//Contiene el control del tiempo.
    celulas = generarMatrizVida(renglones, columnas);//console.log(celulas);//Se genera la matriz donde se guarda la información de las células.
    celulasTemp = generarMatrizVida(renglones, columnas);
    //$("#dibujo").html('<canvas id="mapa" width="100" height="100" style="border:1px solid #000000;" onmousemove="cnvs_getCoordinates(event)"></canvas>');
    var c = document.getElementById("mapa");
    c.width = columnas * tamCelulas;
    c.height = renglones * tamCelulas;
    ctx = c.getContext("2d");
    exterminarVida(celulas);
    generarVida(celulas, cantidadCelulasInicialesVivas, cantidadTotalCelulas);
    recorrerMatriz(celulas, renglones, columnas, pintarCambios);

    $(".tick").click(function() {
        console.log("Le hicieron Tick");
        hacerTick();
    });

    $(".iniciar").click(function() {
        console.log("Se inicia la vida");
        window.clearInterval(funcionTiempo);
        funcionTiempo = window.setInterval(hacerTick, tiempoTicks);
    });

    $(".reiniciar").click(function() {
        console.log("Se reinicia la vida en el universo");
        exterminarVida(celulas);
        cantidadGeneraciones = 0;
        $(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones);
        generarVida(celulas, cantidadCelulasInicialesVivas, cantidadTotalCelulas);
        recorrerMatriz(celulas, renglones, columnas, pintarCambios);
    });

    $(".detener").click(function() {
        console.log("Se detiene la simulación");
        window.clearInterval(funcionTiempo);
    });


});