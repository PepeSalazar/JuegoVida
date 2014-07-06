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

    $("p.tick").click(function() {
        console.log("Le hicieron Tick");
        hacerTick();
    });

    $("p.iniciar").click(function() {
        console.log("Se inicia la vida");
        window.clearInterval(funcionTiempo);
        funcionTiempo = window.setInterval(hacerTick, tiempoTicks);
    });

    $("p.reiniciar").click(function() {
        console.log("Se reinicia la vida en el universo");
        exterminarVida(celulas);
        cantidadGeneraciones = 0;
        $(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones);
        generarVida(celulas, cantidadCelulasInicialesVivas, cantidadTotalCelulas);
        recorrerMatriz(celulas, renglones, columnas, pintarCambios);
    });

    $("p.detener").click(function() {
        console.log("Se detiene la simulación");
        window.clearInterval(funcionTiempo);
    });


});

//Modelo
function generarMatrizVida(renglones, columnas) {
    var matriz = [new Array(renglones)];
    for (cont = 0; cont < renglones; cont++) {//Renglones
        var arregloInterno = [];
        for (cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            identificador = ((cont * columnas) + cont2);//Se calcula el id de cada célula.
            celula = '{"id":' + identificador + ', "renglon":' + cont + ', "columna":' + cont2 + ', "estado":0}'; //console.log("Se crea la célula:" + celula);
            arregloInterno[cont2] = JSON.parse(celula);
        }
        matriz[cont] = arregloInterno;
    }
    return matriz;
}

function recorrerMatriz(/*matriz*/ matriz, /*int*/ renglones, /*int*/ columnas, /*Función JS*/ miFuncion) {
    for (cont = 0; cont < renglones; cont++) {//Renglones
        for (cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            miFuncion(matriz[cont][cont2]);//Se aplica la función a la célula actual.
        }
    }
}

function exterminarVida(/*matriz*/ matriz) {
    recorrerMatriz(matriz, renglones, columnas, matarCelula);
}

function generarVida(matriz, cantidadCelulasInicialesVivas, cantidadTotalCelulas) {
    var numAleatorio = 0;
    var unidades = 0;
    var decenas = 0;
    var identificadorDinamico = "";
    console.log("La cantidad de vida inicial es " + cantidadCelulasInicialesVivas);
    for (var cont = 0; cont <= cantidadCelulasInicialesVivas; cont++) {
        decenas = Math.floor(Math.random() * (renglones));
        unidades = Math.floor(Math.random() * (columnas));
        revivirCelula(matriz[decenas][unidades]);
        //console.log('Se revive a la célula: [' +decenas + ',' + unidades+']');
    }
}

function hacerTick() {
    copiarMatriz(celulas, celulasTemp);
    recorrerMatriz(celulas, renglones, columnas, calcularEstado);
    copiarMatriz(celulasTemp, celulas);
    cantidadGeneraciones++;
    recorrerMatriz(celulas, renglones, columnas, pintarCambios);
    $(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones);
}

function calcularEstado(/*obj json*/celula) {
    //console.log("Se calcula el estado de la célula " + JSON.stringify(celula));
    var cantidadVecinosVivos = ContarVecinosVivos(celula);
    if (cantidadVecinosVivos < 2 && esCelulaViva(celula)) {
        matarCelula(celulasTemp[celula.renglon][celula.columna]); //Se muere por falta de población
    } 
    if ((cantidadVecinosVivos === 2 || cantidadVecinosVivos === 3) && esCelulaViva(celula)) {
        revivirCelula(celulasTemp[celula.renglon][celula.columna]); //Se queda viva
    }
    if (cantidadVecinosVivos > 3 && esCelulaViva(celula)) {
        matarCelula(celulasTemp[celula.renglon][celula.columna]); //Se muere por sobrepoblación
    }
    if (cantidadVecinosVivos === 3 && !esCelulaViva(celula)) {
        revivirCelula(celulasTemp[celula.renglon][celula.columna]); //Revive por reproducción
    }
}

function ContarVecinosVivos(/*obj json*/ celula) {
    var contadorVecinos = 0;
    //console.log("ContarVecinosVivos: Se van a revisar los vecinos de la celula" + JSON.stringify(celula));
    var vecinos = [];
    vecinos.push(obtenerVecino(celula.renglon - 1, celula.columna - 1));
    vecinos.push(obtenerVecino(celula.renglon - 1, celula.columna));
    vecinos.push(obtenerVecino(celula.renglon - 1, celula.columna + 1));
    vecinos.push(obtenerVecino(celula.renglon, celula.columna - 1));
    vecinos.push(obtenerVecino(celula.renglon, celula.columna + 1));
    vecinos.push(obtenerVecino(celula.renglon + 1, celula.columna - 1));
    vecinos.push(obtenerVecino(celula.renglon + 1, celula.columna));
    vecinos.push(obtenerVecino(celula.renglon + 1, celula.columna + 1));

    for (var cont = 0; cont < vecinos.length; cont++) {
        if (vecinos[cont].id !== -1) {//Si existe el vecino
            if (esCelulaViva(vecinos[cont])) {
                contadorVecinos++;
            }
        }
    }
    return contadorVecinos;
}

function obtenerVecino(renglon, columna) {
    var vecino = JSON.parse('{"id":-1, "renglon":-1, "columna":-1, "estado":0}');
    if (renglon >= 0 && columna >= 0 && renglon < renglones && columna < columnas) {
        try {
            vecino = celulas[renglon][columna];
        }
        catch (error) {
            //console.log("obtenerVecino: No existe el vecino ["+renglon+","+columna+"]. Se regresa un vecino finado.");
        }
    }
    //console.log("obtenerVecino: Se regresa el vecino ["+renglon+","+columna+"]:" + JSON.stringify(vecino));
    return vecino;
}

function esCelulaViva(/*obj json*/ celula) {
    //console.log("esCelulaViva: Se verifica si la celula " + JSON.stringify(celula) + " está viva");
    if (celula.estado === 1) {
        return true;
    }
    return false;
}

function matarCelula(/*obj*/ celula) {
    //console.log("matarCelula: Se mata la celula " + celula);
    celula.estado = 0;
}

function revivirCelula(/*obj*/ celula) {
    //console.log("revivirCelula: Se revive la celula " + celula);
    celula.estado = 1;
}

function pintarCambios(/*obj json*/celula) {
    var x = celula.columna * tamCelulas;
    var y = celula.renglon * tamCelulas;
    var x1 = tamCelulas - espacioCelulas; //Separación entre celdas
    var y1 = tamCelulas - espacioCelulas;
    //console.log("Cordenadas celula:" + celula.renglon+","+celula.columna + " " + celula.estado);
    //console.log("Cordenadas gráficas:" + x+","+y+"|"+x1+","+y1);
    if (celula.estado === 0) {
        ctx.fillStyle = "#09C";
    } else if (celula.estado === 1) {
        ctx.fillStyle = "#0C0";
    }
    ctx.fillRect(x, y, x1, y1);
    //ctx.font = "10px Arial";
    //ctx.fillText(celula.estado,x,y);
}

function copiarMatriz(/**/matrizOriginal, matrizCopia) {
    for (cont = 0; cont < renglones; cont++) {//Renglones
        for (cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            (matrizCopia[cont][cont2]).estado = (matrizOriginal[cont][cont2]).estado;
        }
    }
}