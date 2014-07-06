//Modelo

/*
 Descripción:   Genera un arreglo 2D de X renglones y Y columnas.
 Parámetros:    int renglones: La cantidad de renglones de alto que tiene la matriz; int columnas: La cantidad de columnas de ancho que tiene la matriz.
 Regreso:       arreglo2D matriz. La matriz generada.
 */
function generarMatrizVida(/*int*/ renglones, /*int*/ columnas) {
    var matriz = [new Array(renglones)];
    for (cont = 0; cont < renglones; cont++) {//Renglones
        var arregloInterno = [];//Será un renglón.
        for (cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            var identificador = ((cont * columnas) + cont2);//Se calcula el id de cada célula.
            var celula = '{"id":' + identificador + ', "renglon":' + cont + ', "columna":' + cont2 + ', "estado":0}'; //console.log("Se crea la célula:" + celula);
            arregloInterno[cont2] = JSON.parse(celula);
        }
        matriz[cont] = arregloInterno;//Se agrega el renglón nuevo a la matriz.
    }
    return matriz;
}

/*
 Descripción:   Recorre una matriz y le aplica una función.
 Parámetros:    arreglo2D matriz: La matriz que se recorrerá; int renglones: Y de la matriz; int columnas: X de la matriz.
 Regreso:       Ninguno.
 */
function recorrerMatriz(/*arreglo2D*/ matriz, /*int*/ renglones, /*int*/ columnas, /*Función JS*/ miFuncion) {
    for (cont = 0; cont < renglones; cont++) {//Renglones
        for (cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            miFuncion(matriz[cont][cont2]);//Se aplica la función a la célula actual.
        }
    }
}

/*
 Descripción:   Evento apocalítico que deja todas las células muertas :(
 Parámetros:    arreglo2D matriz: La matriz en la que se exterminará la vida.
 Regreso:       Ninguno.
 */
function exterminarVida(/*matriz*/ matriz) {
    recorrerMatriz(matriz, renglones, columnas, matarCelula);
}

/*
 Descripción:   Genera células vivas al azar. Aqui se genera la semilla aleatoriamente.
 Parámetros:    arreglo2D matriz: La matriz en la que se generará la vida :) int cantidadCelulasInicialesVivas.
 Regreso:       Ninguno.
 */
function generarVida(matriz, cantidadCelulasInicialesVivas) {
    var unidades = 0;//Coordenadas de las células a revivir.
    var decenas = 0;
    console.log("La cantidad de vida inicial es " + cantidadCelulasInicialesVivas);
    for (var cont = 0; cont <= cantidadCelulasInicialesVivas; cont++) {
        decenas = Math.floor(Math.random() * (renglones));
        unidades = Math.floor(Math.random() * (columnas));
        revivirCelula(matriz[decenas][unidades]);
        //console.log('Se revive a la célula: [' +decenas + ',' + unidades+']');
    }
}

/*
 Descripción:   Avanza una iteración de cálculos en las células.
 Parámetros:    Ninguno.
 Regreso:       Ninguno.
 */
function hacerTick() {
    copiarMatriz(celulas, celulasTemp);//Se copia la matriz en la que se almacenan los cálculos.
    recorrerMatriz(celulas, renglones, columnas, calcularEstado);//Se calcula el estado de cada célula.
    copiarMatriz(celulasTemp, celulas);//Se aplica el cálculo a la matriz original.
    cantidadGeneraciones++;
    recorrerMatriz(celulas, renglones, columnas, pintarCambios);//Se despliegan los cambios.
    $(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones);
}

/*
 Descripción:   Se calcula el siguiente estado de cada célula basado en el estado de las células vecinas.
 Parámetros:    objJSON celula: La celula a la que se le calcula el estado.
 Regreso:       Ninguno.
 */
function calcularEstado(/*objJSON*/ celula) {
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

/*
 Descripción:   Cuenta las 8 células vecinas vivas de una célula.
 Parámetros:    objJSON celula: La celula a la que se le contarán los vecinos vivos.
 Regreso:       int contadorVecinos: Cantidad de vecinos vivos.
 */
function ContarVecinosVivos(/*objJSON*/ celula) {
    var contadorVecinos = 0;
    //console.log("ContarVecinosVivos: Se van a revisar los vecinos de la celula" + JSON.stringify(celula));
    var vecinos = [];
    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna - 1));
    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna));
    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna + 1));
    vecinos.push(obtenerCelula(celula.renglon, celula.columna - 1));
    vecinos.push(obtenerCelula(celula.renglon, celula.columna + 1));
    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna - 1));
    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna));
    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna + 1));

    for (var cont = 0; cont < vecinos.length; cont++) {
        if (vecinos[cont].id !== -1) {//Si existe el vecino
            if (esCelulaViva(vecinos[cont])) {
                contadorVecinos++;
            }
        }
    }
    return contadorVecinos;
}

/*
 Descripción:   Regresa la célula de cierta cordenada.
 Parámetros:    int renglon; int columna: Las coordenadas de la célula a regresar.
 Regreso:       objJSON celula: La célula encontrada en cierta posición.
 */
function obtenerCelula(/*int*/ renglon, /*int*/ columna) {
    var celula = JSON.parse('{"id":-1, "renglon":-1, "columna":-1, "estado":0}');
    if (renglon >= 0 && columna >= 0 && renglon < renglones && columna < columnas) {
        try {
            celula = celulas[renglon][columna];
        }
        catch (error) {
            //console.log("obtenerCelula: No existe la célula ["+renglon+","+columna+"]. Se regresa una célula finada.");
        }
    }
    //console.log("obtenerCelula: Se regresa la célula ["+renglon+","+columna+"]:" + JSON.stringify(celula));
    return celula;
}

/*
 Descripción:   Verifica si la célula está vida.
 Parámetros:    objJSON celula.
 Regreso:       boolean.
 */
function esCelulaViva(/*objJSON*/ celula) {
    //console.log("esCelulaViva: Se verifica si la celula " + JSON.stringify(celula) + " está viva");
    if (celula.estado === 1) {
        return true;
    }
    return false;
}

/*
 Descripción:   Remueve la vida de una célula :(
 Parámetros:    objJSON celula.
 Regreso:       Ninguno.
 */
function matarCelula(/*objJSON*/ celula) {
    //console.log("matarCelula: Se mata la celula " + celula);
    celula.estado = 0;
}

/*
 Descripción:   Otorga la vida a una célula :)
 Parámetros:    objJSON celula.
 Regreso:       Ninguno.
 */
function revivirCelula(/*objJSON*/ celula) {
    //console.log("revivirCelula: Se revive la celula " + celula);
    celula.estado = 1;
}

/*
 Descripción:   Despliega los cambios del estado de las células en la pantalla.
 Parámetros:    objJSON celula: La celula a ser desplegada.
 Regreso:       Ninguno.
 */
function pintarCambios(/*objJSON*/celula) {
    var x = celula.columna * tamCelulas;//Calcula la posición de la célula en el canvas.
    var y = celula.renglon * tamCelulas;
    var x1 = tamCelulas - espacioCelulas;
    var y1 = tamCelulas - espacioCelulas;
    //console.log("Cordenadas celula:" + celula.renglon+","+celula.columna + " " + celula.estado);
    //console.log("Cordenadas gráficas:" + x+","+y+"|"+x1+","+y1);
    if (celula.estado === 0) {//Varía el colo de la célula de acuerdo a su estado.
        ctx.fillStyle = "#09C";
    } else if (celula.estado === 1) {
        ctx.fillStyle = "#0C0";
    }
    ctx.fillRect(x, y, x1, y1);//Rellena la célula del color elegido.
    //ctx.font = "10px Arial";
    //ctx.fillText(celula.estado,x,y);
}

/*
 Descripción:   Copia los estados de las células de una matriz a otra.
 Parámetros:    arreglo2D matrizOriginal: La matriz de la cual se copian los estados.
                arreglo2D matrizCopia: La matriz en la que se copian los estados.
 Regreso:       Ninguno. Los cambios se hacen ahí mismo.
 */
function copiarMatriz(/*arreglo2D*/matrizOriginal, /*arreglo2D*/ matrizCopia) {
    for (cont = 0; cont < renglones; cont++) {//Renglones
        for (cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            (matrizCopia[cont][cont2]).estado = (matrizOriginal[cont][cont2]).estado;
        }
    }
}