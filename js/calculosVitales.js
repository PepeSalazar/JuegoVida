//Variables Globales
	var renglones = 200;
	var columnas = 200;
	var tiempoTicks = 200; //Milisegundos
	var cantidadGeneraciones = 0;
	var celulas = [new Array(renglones)];//console.log(celulas);
	var celulasTemp;
	var tamCelulas = 2;//Normalmente es 4
	var espacioCelulas = 0;//Regularmente es 0.6
	var ctx;
	
//Control	
$(document).ready(function() {
	//alert("Documento listo para trabajar");
	var cont = 0;//Se limpian los contadores.
	var cont2 = 0;
	var identificador = 0;
	var cantidadTotalCelulas = renglones * columnas;
	var cantidadCelulasInicialesVivas = cantidadTotalCelulas * 0.3;
	var celula = '{"id":0, "renglon":0, "columna":0, "estado":0}';//Objeto JSON
	//console.log(celula);
	console.log("Renglones:"+renglones + " Columnas:" + columnas);
	var funcionTiempo;//Contiene el control del tiempo.
	//var cuerpoTabla = $("#mapa").find("tbody");//Se agrega el cuerpo de la tabla #mapa a una variable.
	celulas = generarMatrizVida(renglones, columnas);//console.log(celulas);//Se genera la matriz donde se guarda la información de las células.
	celulasTemp = generarMatrizVida(renglones, columnas);
	var c=document.getElementById("mapa2");
	c.width = columnas * tamCelulas;
	c.height = renglones * tamCelulas;
	ctx=c.getContext("2d");

//	for (cont=0;cont<renglones;cont++){//Renglones
//		$(cuerpoTabla).append('<tr id="ren_'+cont+'"></tr>');//Se agrega el renglón
//		for (cont2=0;cont2<columnas;cont2++){//Columnas
//			identificador = ((cont*columnas)+cont2);//Se calcula el id de cada célula.
//			$(cuerpoTabla).find("tr:last").append('<td id="'+identificador+'" class="celula muerta" renglon="'+cont+'" columna="'+cont2+'"></td>');//Se agrega la célula. Todas las celúlas comienzan en estado muerto.
//		}
//	}
	exterminarVida(celulas);
	generarVida(celulas, cantidadCelulasInicialesVivas, cantidadTotalCelulas);
	recorrerMatriz(celulas, renglones, columnas, pintarCambios);
	
	$( "p.tick" ).click(function() {
	  console.log("Le hicieron Tick");
	  hacerTick();
	});
	
	$( "p.iniciar" ).click(function() {
		console.log("Se inicia la vida");
		window.clearInterval(funcionTiempo);
		funcionTiempo = window.setInterval(hacerTick, tiempoTicks);
	});
	
	$( "p.reiniciar" ).click(function() {
		console.log("Se reinicia la vida en el universo");
		exterminarVida(celulas);
		cantidadGeneraciones = 0;
		$(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones);
		generarVida(celulas, cantidadCelulasInicialesVivas, cantidadTotalCelulas);
		recorrerMatriz(celulas, renglones, columnas, pintarCambios);
	});
	
	$( "p.detener" ).click(function() {
		console.log("Se detiene la simulación");
		window.clearInterval(funcionTiempo);
	});
	

});


//Modelo
function generarMatrizVida(renglones, columnas){
	var matriz = [new Array(renglones)];
	for (cont=0;cont<renglones;cont++){//Renglones
		var arregloInterno=[];
		for (cont2=0;cont2<columnas;cont2++){//Columnas
			identificador = ((cont*columnas)+cont2);//Se calcula el id de cada célula.
			//arregloInterno[cont2] = identificador;
			celula = '{"id":'+identificador+', "renglon":'+cont+', "columna":' +cont2 +', "estado":0}';
			//console.log("Se crea la célula:" + celula);
			arregloInterno[cont2] = JSON.parse(celula);
		}
		matriz[cont] = arregloInterno;
	}
	return matriz;
}

function recorrerMatriz(/*matriz*/ matriz, /*int*/ renglones, /*int*/ columnas, /*Función JS*/ miFuncion){
	for (cont=0;cont<renglones;cont++){//Renglones
		for (cont2=0;cont2<columnas;cont2++){//Columnas
			//console.log("Se aplica la función a la célula " + cont + "," + cont2);
			miFuncion(matriz[cont][cont2]);//Se aplica la función a la célula actual.
		}
	}
}

function exterminarVida(/*matriz*/ matriz){
/*	$(".celula").each(function(index, element) {
        matarCelula($(this));
    }); 
*/	
	recorrerMatriz(matriz, renglones, columnas, matarCelula);
}

function generarVida(matriz, cantidadCelulasInicialesVivas, cantidadTotalCelulas){
	var numAleatorio = 0;
	var unidades = 0;
	var decenas = 0;
	var identificadorDinamico = "";
	console.log("La cantidad de vida inicial es " + cantidadCelulasInicialesVivas);
	for (var cont = 0; cont <= cantidadCelulasInicialesVivas; cont++){
		//numAleatorio = Math.floor(Math.random() * (columnas)); //Se calcula un número aleatorio para revivir células.
		//console.log("Se genera un número aleatorio:" + numAleatorio);
		//decenas = Math.floor((numAleatorio / 10));
		//unidades = (numAleatorio % 10);
		decenas = Math.floor(Math.random() * (renglones));
		unidades = Math.floor(Math.random() * (columnas));
		//console.log("Se intenta revivir la célula " + JSON.stringify(matriz[decenas][unidades]));
		try{
			//revivirCelula(matriz[decenas][unidades]);			
		}
		catch(error){console.log(error);}
		revivirCelula(matriz[decenas][unidades]);			
		//console.log('Se revive a la célula: [' +decenas + ',' + unidades+']');
		//identificador = Math.floor(Math.random() * (cantidadTotalCelulas)); //Se calcula un número aleatorio para revivir células.
		//identificadorDinamico = "td#"+identificador+".celula.muerta";
		//$(identificadorDinamico).addClass("viva").removeClass("muerta");//Se le da vida a una célula.
	}
}

function hacerTick(){
//	$(".celula").each(function(index, element) {//Se recorren todas las células.
//		var celula = $(this);//console.log($(celula).hasClass("viva"));console.log("Célula " + $(this).attr("id"));
//		calcularEstado(celula);
//	});
	//celulasTemp = celulas.slice();
	copiarMatriz(celulas, celulasTemp);
	recorrerMatriz(celulas, renglones, columnas, calcularEstado);
	copiarMatriz(celulasTemp, celulas);
	cantidadGeneraciones++;
	recorrerMatriz(celulas, renglones, columnas, pintarCambios);
	$(".informacion").html("Generaci&oacute;n: " + cantidadGeneraciones);
}

function calcularEstado(/*obj json*/celula){
	//var celulaId = parseInt($(celula).attr("id"));
	//console.log("Se calcula el estado de la célula " + JSON.stringify(celula));
	var cantidadVecinosVivos = ContarVecinosVivos(celula);
	if(cantidadVecinosVivos < 2 && esCelulaViva(celula)){
		//matarCelula(celula) //Se muere por falta de población
		matarCelula(celulasTemp[celula.renglon][celula.columna]) //Se muere por falta de población
	}
	if ((cantidadVecinosVivos == 2 || cantidadVecinosVivos == 3) && esCelulaViva(celula)){
		//Se queda viva
		revivirCelula(celulasTemp[celula.renglon][celula.columna]) //Se muere por falta de población
	}
	if (cantidadVecinosVivos > 3 && esCelulaViva(celula)){
		//matarCelula(celula) //Se muere por sobrepoblación
		matarCelula(celulasTemp[celula.renglon][celula.columna]) //Se muere por falta de población
	}
	if (cantidadVecinosVivos == 3 && !esCelulaViva(celula)){
		//revivirCelula(celula); //Revive por reproducción
		revivirCelula(celulasTemp[celula.renglon][celula.columna]) //Se muere por falta de población
	}
}

function ContarVecinosVivos(/*obj json*/ celula){
	var contadorVecinos = 0;
//	var vecino1 = (celulaId-columnas-1);
//	var vecino2 = (celulaId-columnas);
//	var vecino3 = (celulaId-columnas+1);
//	var vecino4 = (celulaId-1);
//	var vecino5 = (celulaId+1);
//	var vecino6 = (celulaId+columnas-1);
//	var vecino7 = (celulaId+columnas);
//	var vecino8 = (celulaId+columnas+1);
	//console.log("ContarVecinosVivos: Se van a revisar los vecinos de la celula" + JSON.stringify(celula));
	var vecinos = [];
	vecinos.push(obtenerVecino(celula.renglon-1, celula.columna-1));
	vecinos.push(obtenerVecino(celula.renglon-1, celula.columna));
	vecinos.push(obtenerVecino(celula.renglon-1, celula.columna+1));
	vecinos.push(obtenerVecino(celula.renglon, celula.columna-1));
	vecinos.push(obtenerVecino(celula.renglon, celula.columna+1));
	vecinos.push(obtenerVecino(celula.renglon+1, celula.columna-1));
	vecinos.push(obtenerVecino(celula.renglon+1, celula.columna));
	vecinos.push(obtenerVecino(celula.renglon+1, celula.columna+1));
		
	for(var cont = 0; cont<vecinos.length; cont++){
		if (vecinos[cont].id != -1){//Si existe el vecino
			if(esCelulaViva(vecinos[cont])){
				contadorVecinos++;
			}
		}
	}
//	if(esCelulaViva(vecino1)){contadorVecinos++;}
//	if(esCelulaViva(vecino2)){contadorVecinos++;}
//	if(esCelulaViva(vecino3)){contadorVecinos++;}
//	if(esCelulaViva(vecino4)){contadorVecinos++;}
//	if(esCelulaViva(vecino5)){contadorVecinos++;}
//	if(esCelulaViva(vecino6)){contadorVecinos++;}
//	if(esCelulaViva(vecino7)){contadorVecinos++;}
//	if(esCelulaViva(vecino8)){contadorVecinos++;}
/*	
	for(var cont = vecino1; cont <= vecino8; cont++){
		if ($("td#"+cont+".celula").hasClass("viva")){
			console.log("La célula "+cont+" está viva");
			contadorVecinos++;
		}
	}
*/
	return contadorVecinos;
}

function obtenerVecino(renglon, columna){
	var vecino = JSON.parse('{"id":-1, "renglon":-1, "columna":-1, "estado":0}');
	
	if (renglon >= 0 && columna >=0 && renglon<renglones && columna<columnas){
		try{
			vecino = celulas[renglon][columna];
		}
		catch(error){
			//console.log("obtenerVecino: No existe el vecino ["+renglon+","+columna+"]. Se regresa un vecino finado.");
		}
	}

	//console.log("obtenerVecino: Se regresa el vecino ["+renglon+","+columna+"]:" + JSON.stringify(vecino));
	return vecino;
}

//function esCelulaViva(idCelula /*int*/){
//	//console.log("Se calcula el estado de la célula vecina " + idCelula);
//	if ($("td#"+idCelula+".celula").hasClass("viva")){
//		//console.log("La célula "+idCelula+" está viva");
//		return true;
//	}
//	return false;
//}
function esCelulaViva(/*obj json*/ celula){
	//console.log("esCelulaViva: Se verifica si la celula " + JSON.stringify(celula) + " está viva");
	if (celula.estado == 1){
		return true;
	}
	return false;
}

//function matarCelula(celula /*td.celula*/){
//	$(celula).addClass("muerta").removeClass("viva");
//}
function matarCelula(/*obj*/ celula){
	//console.log("matarCelula: Se mata la celula " + celula);
	celula.estado = 0
	//celula = 0;
}


//function revivirCelula(celula /*td.celula*/){
//	$(celula).addClass("viva").removeClass("muerta");
//}
function revivirCelula(/*obj*/ celula){
	//console.log("revivirCelula: Se revive la celula " + celula);
//	celula = 1;
	celula.estado = 1;
}

function pintarCambios(/*obj json*/celula){
	var x = celula.columna * tamCelulas;
	var y = celula.renglon * tamCelulas;
	var x1 = tamCelulas - espacioCelulas; //Separación entre celdas
	var y1 = tamCelulas - espacioCelulas;
	//console.log("Cordenadas celula:" + celula.renglon+","+celula.columna + " " + celula.estado);
	//console.log("Cordenadas gráficas:" + x+","+y+"|"+x1+","+y1);
	if(celula.estado==0){
		ctx.fillStyle="#09C";
	} else if(celula.estado==1){
		ctx.fillStyle="#0C0";
	}
	ctx.fillRect(x,y,x1,y1);
	
	//ctx.font = "10px Arial";
	//ctx.fillText(celula.estado,x,y);
	

//	var celulaGrafica = $("#mapa").find(".celula#" + celula.id);
//	if(celula.estado==0){
//		$(celulaGrafica).addClass("muerta").removeClass("viva");
//	} else if(celula.estado==1){
//		$(celulaGrafica).addClass("viva").removeClass("muerta");
//	}

}

function copiarMatriz(/**/matrizOriginal, matrizCopia){
	//var nuevaMatriz = generarMatrizVida(renglones, columnas);
	//celulaCopia = celulasTemp[celulaOriginal.renglon][celulaOriginal.columna]
	for (cont=0;cont<renglones;cont++){//Renglones
		for (cont2=0;cont2<columnas;cont2++){//Columnas
			//console.log("Se aplica la función a la célula " + cont + "," + cont2);
			(matrizCopia[cont][cont2]).estado = (matrizOriginal[cont][cont2]).estado;		
		}
	}	
}

function cnvs_getCoordinates(e)
{
x=e.clientX;

y=e.clientY;
document.getElementById("lol").innerHTML="Coordinates: (" + x + "," + y + ")";
}

