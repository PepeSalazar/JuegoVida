//Modelo
//var colonia = [];
//var celulaEjemplo = JSON.parse('{"id":0, "renglon":0, "columna":0, "estado":1}');
//colonia.push(celulaEjemplo);
//celulaEjemplo = JSON.parse('{"id":1, "renglon":0, "columna":1, "estado":1}');
//colonia.push(celulaEjemplo);
//celulaEjemplo = JSON.parse('{"id":2, "renglon":1, "columna":0, "estado":1}');
//colonia.push(celulaEjemplo);
//celulaEjemplo = JSON.parse('{"id":3, "renglon":1, "columna":1, "estado":1}');
//colonia.push(celulaEjemplo);//Se agrega un cuadrito de células.
//colonias = [new Array()];
//colonias.push(colonia);
//
//celulaEjemplo = JSON.parse('{"id":3, "renglon":1, "columna":1, "estado":1}');
//var celulaBuscada = buscarCelulaEnColonia(celulaEjemplo, colonia);
//console.log(colonia);
//console.log("Se buscó la célula " + JSON.stringify(celulaEjemplo) + " y se encontró " + JSON.stringify(celulaBuscada));

/*
 Descripción:   Genera un arreglo 2D de X renglones y Y columnas.
 Parámetros:    int renglones: La cantidad de renglones de alto que tiene la matriz; int columnas: La cantidad de columnas de ancho que tiene la matriz.
 Regreso:       arreglo2D matriz. La matriz generada.
 */
function generarMatrizVida(/*int*/ renglones, /*int*/ columnas) {
    var matriz = [new Array(renglones)];
    for (var cont = 0; cont < renglones; cont++) {//Renglones
        var arregloInterno = [];//Será un renglón.
        for (var cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            var identificador = ((cont * columnas) + cont2);//Se calcula el id de cada célula.
            var celula = '{"id":' + identificador + ', "renglon":' + cont + ', "columna":' + cont2 + ', "estado":0, "colonia":-1}'; //console.log("Se crea la célula:" + celula);
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
    for (var cont = 0; cont < renglones; cont++) {//Renglones
        for (var cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            miFuncion(matriz[cont][cont2]);//Se aplica la función a la célula actual.
        }
    }
}

function generarUniverso() {
    columnas = document.getElementById("columnas").value;
    renglones = document.getElementById("renglones").value;
    tamCelulas = document.getElementById("tamanio").value;
    porcentajeVida = document.getElementById("porcentaje").value;

    if (isNaN(columnas)) {
        columnas = 20;
    }
    if (isNaN(renglones)) {
        renglones = 20;
    }
    if (isNaN(tamCelulas)) {
        tamCelulas = 4;
    }
    if (isNaN(porcentajeVida)) {
        porcentajeVida = 0.4;
    }

    cantidadTotalCelulas = renglones * columnas;
    cantidadCelulasInicialesVivas = cantidadTotalCelulas * porcentajeVida;
    console.log("Renglones:" + renglones + " Columnas:" + columnas);

    cantidadGeneraciones = 0;
    cantidadColonias = 0;
    //$(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones + "<br>Cantidad de colonias: " + cantidadColonias);
    celulas = generarMatrizVida(renglones, columnas);//console.log(celulas);//Se genera la matriz donde se guarda la información de las células.
    celulasTemp = generarMatrizVida(renglones, columnas);//Se genera la matriz en donde se guarda el cálculo de la siguiente generación.
    var c = document.getElementById("mapa");//Se obtiene el mapa donde se despliega la vida.
    c.width = columnas * tamCelulas;// + (espacioCelulas * columnas);//Se calcula el tamaño del mapa en base a la cantidad de células que tiene.
    c.height = renglones * tamCelulas;// + (espacioCelulas * renglones);
    ctx = c.getContext("2d");
    exterminarVida(celulas);//Se reinicia el mapa.
    generarVida(celulas, cantidadCelulasInicialesVivas);//Se genera vida nueva de manera aleatoria.
    recorrerMatriz(celulas, renglones, columnas, encontrarColonias);//Se analiza la cantidad de colonias existentes.    
    recorrerMatriz(celulas, renglones, columnas, pintarCambios);//Se pinta por primera vez el mapa.
    $(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones + "<br>Cantidad de colonias: " + cantidadColonias);

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
    cantidadColonias = 0;
    copiarMatriz(celulas, celulasTemp);//Se copia la matriz en la que se almacenan los cálculos.
    recorrerMatriz(celulas, renglones, columnas, calcularEstado);//Se calcula el estado de cada célula.
    copiarMatriz(celulasTemp, celulas);//Se aplica el cálculo a la matriz original.
    recorrerMatriz(celulas, renglones, columnas, encontrarColonias);//Se analiza la cantidad de colonias existentes.
    cantidadGeneraciones++;
    recorrerMatriz(celulas, renglones, columnas, pintarCambios);//Se despliegan los cambios.
    $(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones + "<br>Cantidad de colonias: " + cantidadColonias);
}

/*
 Descripción:   Se calcula el siguiente estado de cada célula basado en el estado de las células vecinas.
 Parámetros:    objJSON celula: La celula a la que se le calcula el estado.
 Regreso:       Ninguno.
 */
function calcularEstado(/*objJSON*/ celula) {
    //console.log("Se calcula el estado de la célula " + JSON.stringify(celula));
    var b = 3;//3
    var s = [2, 3];//2,3
    var cantidadVecinosVivos = ContarVecinosVivos(celula);
//    if (cantidadVecinosVivos < 2 && esCelulaViva(celula)) {
//        matarCelula(celulasTemp[celula.renglon][celula.columna]); //Se muere por falta de población
//    }
//    if ((cantidadVecinosVivos === 2 || cantidadVecinosVivos === 3) && esCelulaViva(celula)) {
//        revivirCelula(celulasTemp[celula.renglon][celula.columna]); //Se queda viva
//    }
//    if (cantidadVecinosVivos > 3 && esCelulaViva(celula)) {
//        matarCelula(celulasTemp[celula.renglon][celula.columna]); //Se muere por sobrepoblación
//    }
//    if (cantidadVecinosVivos === 3 && !esCelulaViva(celula)) {
//        revivirCelula(celulasTemp[celula.renglon][celula.columna]); //Revive por reproducción
//    }
    if (cantidadVecinosVivos < s[0] && esCelulaViva(celula)) {
        matarCelula(celulasTemp[celula.renglon][celula.columna]); //Se muere por falta de población
    }
    if ((cantidadVecinosVivos === s[0] || cantidadVecinosVivos === s[1]) && esCelulaViva(celula)) {
        revivirCelula(celulasTemp[celula.renglon][celula.columna]); //Se queda viva
    }
    if (cantidadVecinosVivos > s[1] && esCelulaViva(celula)) {
        matarCelula(celulasTemp[celula.renglon][celula.columna]); //Se muere por sobrepoblación
    }
    if (cantidadVecinosVivos === b && !esCelulaViva(celula)) {
        revivirCelula(celulasTemp[celula.renglon][celula.columna]); //Revive por reproducción
    }
    //console.log("Se reinicia la colonia de la célula:" + JSON.stringify(celulasTemp[celula.renglon][celula.columna]));
    (celulasTemp[celula.renglon][celula.columna]).colonia = -1; //Revive por reproducción
}

/*
 Descripción:   Analiza y reconoce conjuntos de células para agruparalas en colonias.
 Parámetros:    objJSON celula: La celula a la que se le busca una colonia.
 Regreso:       Ninguno.
 */
function encontrarColonias(/*objJSON*/ celula, /*objJSON*/ celulaPadre) {
    if (celula.estado !== 1) {
        return;
    }
    //console.log("Se busca las colonia de la célula:" + JSON.stringify(celula));
    if (celula.colonia !== -1) {//Pertenece a una colonia
        //console.log("Ya pertenece a la colonia " + celula.colonia + ", no se revisa.");
        return;//Ya pertenece a una colonia
    } else {//No pertenece a una colonia
        //if (celulaPadre !== undefined){//Tiene un padre
        if (typeof celulaPadre !== 'undefined') {//Tiene un padre
            //console.log("Tiene padre de la colonia:" + celulaPadre.colonia);
            celula.colonia = celulaPadre.colonia;
        } else {//Es huérfano, inicia una colonia nueva.
            var nuevaColonia = Math.random() * (255);
            cantidadColonias++;
            //console.log("Funda la colonia:" + nuevaColonia);
            celula.colonia = nuevaColonia;
        }
        var celulasVecinas = obtenerCelulasVecinas(celula);

        for (var cont2 = 0; cont2 < celulasVecinas.length; cont2++) {//Por cada celula vecina
            var celulaVecina = celulasVecinas[cont2];
            if (celulaVecina.id !== -1 && celulaVecina.estado === 1 && !comparaCelula(celulaVecina, celulaPadre)) {//Si es célula vecina válida y viva, y no su padre.
                encontrarColonias(celulaVecina, celula);
            }
        }
    }
//    pertenezco a una colonia?
//    tengo padre?
//    por cada vecino


//    var cantidadVecinosColonos = 0;//Cantidad de células vecinas vivas que pertenecean a una colonia.
//    if (celula.estado === 0) {//Si está muerta
//        return;//No tiene caso buscarle colonia
//    }
//    //console.log("Colonias:" + colonias.length);
//    var celulasVecinas = obtenerCelulasVecinas(celula);
//    if (celulasVecinas.length === 0) {//No tiene vecinos y genera su propia colonia
//
//    }
//
//    for (var cont2 = 0; cont2 < celulasVecinas.length; cont2++) {//Por cada celula vecina
//        var celulaVecina = celulasVecinas[cont2];
//        if (celulaVecina.id !== -1 && celulaVecina.estado === 1) {//Si es célula vecina válida y viva
//            if (colonias.length === 0) {//No existe ninguna colonia aún.
//                var colonia = [];
//                colonia.push(celula);
//                colonias.push(colonia);
//                console.log("Se genera la primera colonia.")
//                return;
//            }
//            for (var cont = 0; cont < colonias.length; cont++) {//Se busca en cada colonia
//                var colonia = colonias[cont];
//                var celulaEncontrada = buscarCelulaEnColonia(celulaVecina, colonia);
//                if (celulaEncontrada.id !== -1) {//Si es una célula válida
//                    console.log("Se guarda la célula " + JSON.stringify(celula));
//                    //colonia.push(celula);
//                }
//            }
//        }
//    }
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
//    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna - 1));
//    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna));
//    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna + 1));
//    vecinos.push(obtenerCelula(celula.renglon, celula.columna - 1));
//    vecinos.push(obtenerCelula(celula.renglon, celula.columna + 1));
//    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna - 1));
//    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna));
//    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna + 1));
    vecinos = obtenerCelulasVecinas(celula);

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
 Descripción:   Obtiene las 8 células vecinas vivas de una célula.
 Parámetros:    objJSON celula: La celula a la que se le obtendrán sus vecinos vivos.
 Regreso:       arreglo vecinos: Arreglo con los vecinos vivos.
 */
function obtenerCelulasVecinas(/*objJSON*/ celula) {
    var vecinos = [];
    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna - 1));
    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna));
    vecinos.push(obtenerCelula(celula.renglon - 1, celula.columna + 1));
    vecinos.push(obtenerCelula(celula.renglon, celula.columna - 1));
    vecinos.push(obtenerCelula(celula.renglon, celula.columna + 1));
    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna - 1));
    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna));
    vecinos.push(obtenerCelula(celula.renglon + 1, celula.columna + 1));
    return vecinos;
}

/*
 Descripción:   Regresa la célula de cierta cordenada.
 Parámetros:    int renglon; int columna: Las coordenadas de la célula a regresar.
 Regreso:       objJSON celula: La célula encontrada en cierta posición.
 */
function obtenerCelula(/*int*/ renglon, /*int*/ columna) {
    var celula = JSON.parse('{"id":-1, "renglon":-1, "columna":-1, "estado":0, "colonia":-1}');//Célula dummy
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
 Descripción:   Busca una célula dentro de una colonia.
 Parámetros:    objJSON celula: La célula buscada; arreglo colonia: Donde se busca la célula.
 Regreso:       objJSON.
 */
function buscarCelulaEnColonia(/*objJSON*/ celulaBuscada, /*arreglo*/ colonia) {
    console.log(colonia.length);
    for (var cont = 0; cont < colonia.length; cont++) {//No quiso jalar el for each;
        var celulaActual = colonia[cont];
        //console.log(celulaActual);
        if (celulaActual.id === celulaBuscada.id && celulaActual.renglon === celulaBuscada.renglon && celulaActual.columna === celulaBuscada.columna) {
            return celulaActual;
        }
    }
    return JSON.parse('{"id":-1, "renglon":-1, "columna":-1, "estado":0, "colonia":-1}');//Célula dummy
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
    //console.log("matarCelula: Se mata la celula " + JSON.stringify(celula));
    celula.estado = 0;
    //celula.colonia = -1;
}

/*
 Descripción:   Otorga la vida a una célula :)
 Parámetros:    objJSON celula.
 Regreso:       Ninguno.
 */
function revivirCelula(/*objJSON*/ celula) {
    //console.log("revivirCelula: Se revive la celula " + celula);
    celula.estado = 1;
    //celula.colonia = -1;
}

/*
 Descripción:   Compara dos células.
 Parámetros:    objJSON celulaOriginal; objJSON celulaComparada.
 Regreso:       boolean.
 */
function comparaCelula(/*objJSON*/celulaOriginal, /*objJSON*/celulaComparada) {
    if (typeof celulaOriginal !== 'undefined' || typeof celulaComparada !== 'undefined') {//No recibió una célula con la cual comparar.
        return false;
    }
    if (celulaOriginal.columna === celulaComparada.columna && celulaOriginal.renglon === celulaComparada.renglon) {
        return true;
    }
    return false;
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
        //ctx.fillStyle = "#0C0";
        var cadena = Math.floor(celula.colonia);
        cadena = cadena.toString(16);
        //ctx.fillStyle = "#00CC" + cadena;
        ctx.fillStyle = "#0C0";
        //console.log(cadena);
    }
    ctx.fillRect(x, y, x1, y1);//Rellena la célula del color elegido.
    if (celula.colonia !== -1) {//Lo uso para desplegar información acerca de la célula.
        //console.log("Se pinta la célula:" + JSON.stringify(celula));
        //ctx.fillStyle = "#000";
        //ctx.font = "10px Arial";
        //ctx.fillText(celula.colonia, (x + tamCelulas / 2), (y + tamCelulas / 2));
    }
}

/*
 Descripción:   Copia los estados de las células de una matriz a otra.
 Parámetros:    arreglo2D matrizOriginal: La matriz de la cual se copian los estados.
 arreglo2D matrizCopia: La matriz en la que se copian los estados.
 Regreso:       Ninguno. Los cambios se hacen ahí mismo.
 */
function copiarMatriz(/*arreglo2D*/matrizOriginal, /*arreglo2D*/ matrizCopia) {
    for (var cont = 0; cont < renglones; cont++) {//Renglones
        for (var cont2 = 0; cont2 < columnas; cont2++) {//Columnas
            (matrizCopia[cont][cont2]).estado = (matrizOriginal[cont][cont2]).estado;
            (matrizCopia[cont][cont2]).colonia = (matrizOriginal[cont][cont2]).colonia;
        }
    }
}