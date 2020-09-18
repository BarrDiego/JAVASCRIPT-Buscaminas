const buscaminas ={
    numMinasTot:30,
    numMinasEnc:0,
    numFilas:15,
    numColumnas:15,
    aCampoMinas:[]

}



// FUNCION PARA PINTAR CASILLAS
function pintarTablero(){
    let tablero =  document.querySelector("#tablero");

    document.querySelector("html").style.setProperty("--num-filas",buscaminas.numFilas);
    document.querySelector("html").style.setProperty("--num-columnas",buscaminas.numColumnas);
    
    //borrar tablero actual
    while(tablero.firstChild){
        tablero.firstChild.removeEventListener("contextmenu",marcar);
        tablero.firstChild.removeEventListener("click",mostrar);
        tablero.removeChild(tablero.firstChild);
    }

    for( let f = 0; f < buscaminas.numFilas; f++){
        for( let c = 0; c < buscaminas.numColumnas; c++){
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id","f"+f+"_c"+c); //agregar id a los divs
            newDiv.dataset.fila = f;
            newDiv.dataset.columna = c;
            newDiv.addEventListener("contextmenu", marcar); //right-click
            newDiv.addEventListener("click", mostrar) //left-click
            tablero.appendChild(newDiv);
        }
    }    
}



function marcar(evento){
    if(evento.type === "contextmenu"){
        console.log(evento);
        let casilla=evento.currentTarget;
        evento.stopPropagation();
        evento.preventDefault();
        let fila = parseInt(casilla.dataset.fila,10);
        let columna = parseInt(casilla.dataset.columna,10);

        if(fila>=0 && columna>=0 && fila < buscaminas.numFilas && columna < buscaminas.numColumnas){
            if(casilla.classList.contains("icon-bandera")){
                casilla.classList.remove("icon-bandera");
                casilla.classList.add("icon-duda");
                buscaminas.numMinasEnc--;
            }else if(casilla.classList.contains("icon-duda")){
                casilla.classList.remove("icon-duda");
            }else if (casilla.classList.length == 0){
                casilla.classList.add("icon-bandera");
                buscaminas.numMinasEnc++;
                if(buscaminas.numMinasEnc == buscaminas.numMinasTot){
                    resolverTablero(true);
                }
            }
            actualizarMinasRestantes();
        }
    }
}

function mostrar(evento){
    if(evento.type === "click"){
        let casilla = evento.currentTarget;
        let fila = parseInt(casilla.dataset.fila,10);
        let columna = parseInt(casilla.dataset.columna,10);

        develarCasilla(fila,columna);
    }
}

function develarCasilla(fila,columna){
    
    //dentro del tablero
    if(fila > -1 && fila < buscaminas.numFilas && columna > -1 && columna < buscaminas.numColumnas){
        console.log("develamos la casilla: fila: " + fila + ", columna: " + columna);
        let casilla = document.querySelector("#f" + fila + "_c" + columna);
       //nos aseguramos q no este develada y si no tiene icono de bandera
        if (!casilla.classList.contains("develado")){
            if(!casilla.classList.contains("icon-bandera")){
                casilla.classList.add("develado");
                casilla.innerHTML = buscaminas.aCampoMinas[fila][columna];//agregamos los numeros alrededor de la casilla
                casilla.classList.add("c" + buscaminas.aCampoMinas[fila][columna]);
                //si no es bomba y tiene 0 minas alrededor, detapamos las casillas contiguas
                if(buscaminas.aCampoMinas[fila][columna] !== "B"){
                    if(buscaminas.aCampoMinas[fila][columna] == 0){
                        develarCasilla(fila-1,columna-1);
                        develarCasilla(fila-1,columna);
                        develarCasilla(fila-1,columna+1);
                        develarCasilla(fila,columna-1);
                        develarCasilla(fila,columna+1);
                        develarCasilla(fila+1,columna-1);
                        develarCasilla(fila+1,columna);
                        develarCasilla(fila+1,columna+1);
                        casilla.innerHTML = "";
                    }
                }else if(buscaminas.aCampoMinas[fila][columna]){
                    casilla.innerHTML = "";
                    casilla.classList.add("icon-bomba");
                    casilla.classList.add("sinmarcar");
                    resolverTablero(false);
                }
            }
        }
    }
}

function generarCampoMinasVacias(){
    buscaminas.aCampoMinas=new Array(buscaminas.numFilas);
    for( let fila = 0; fila < buscaminas.numFilas; fila++){
        buscaminas.aCampoMinas[fila] = new Array(buscaminas.numColumnas);
    }
}

function esparcirMinas(){
    let numMinasEsparcidas = 0;

    while(numMinasEsparcidas < buscaminas.numMinasTot){

        let fila = Math.floor(Math.random() * buscaminas.numFilas); //nro aleatorio para filas
        let columna = Math.floor(Math.random() * buscaminas.numColumnas); //nro aleatorio para columnas

        //si no existe bomba en esa ubicacion la colocamos
        if(buscaminas.aCampoMinas[fila][columna] != "B"){
            buscaminas.aCampoMinas[fila][columna] = "B";
            numMinasEsparcidas++;
        }
    }
}

function contarMinasALrededorCasilla(fila,columna){
    let numeroMinasAlrededor=0;

    //contar fila de anterior a posterior
    for(let zFila = fila-1; zFila <= fila+1; zFila++){
        //contar columna de anterior a posterior
        for(let zColumna =  columna-1; zColumna <= columna+1; zColumna++){
            //ubicar dentro del tablero
            if(zFila > -1 && zFila < buscaminas.numFilas && zColumna > -1 && zColumna < buscaminas.numColumnas){
                //miramos si hay minas en este casillero
                if(buscaminas.aCampoMinas[zFila][zColumna] == "B"){
                    numeroMinasAlrededor++; // +1 al casillero vacio

                }
            }
        }
    }
    buscaminas.aCampoMinas[fila][columna] = numeroMinasAlrededor; //se guarda cuantas minas hay en esa posicion

}

//funcion para contar cuantas minas hay alrededor de cada casilla
function contarMinas(){
    for(let fila = 0; fila < buscaminas.numFilas; fila++){
        for (let columna = 0; columna < buscaminas.numColumnas; columna++){
            if(buscaminas.aCampoMinas[fila][columna] != "B"){
                contarMinasALrededorCasilla(fila,columna);
            }
        }
    }
}

function actualizarMinasRestantes(){
    document.querySelector("#numMinasRestantes").innerHTML = (buscaminas.numMinasTot- buscaminas.numMinasEnc);
}

function resolverTablero(isOK){
    let aCasillas = tablero.children;
    for(let i = 0; i < aCasillas.length; i++){
        aCasillas[i].removeEventListener("click",mostrar);
        aCasillas[i].removeEventListener("contextmenu",marcar);
        let fila = parseInt(aCasillas[i].dataset.fila,10);
        let columna = parseInt(aCasillas[i].dataset.fila,10);

        if(aCasillas[i].classList.contains("icon-bandera")){
            if(buscaminas.aCampoMinas[fila][columna] == "B"){
                aCasillas[i].classList.add("develado");
                aCasillas[i].classList.remove("icon-bandera");
                aCasillas[i].classList.add("icon-bomba");
            }else{
                aCasillas[i].classList.add("develado");
                aCasillas[i].classList.add("banderaErronea");
                isOK = false;
                
            }
        }else if (!aCasillas[i].classList.contains("develado")){
            if(buscaminas.aCampoMinas[fila][columna] == "B"){
                aCasillas[i].classList.add("develado");
                aCasillas[i].classList.add("icon-bomba");
            }
        }
    }
    if (isOK){
        alert("Felicitaciones!!!")
        inicio();
    } 
}

  


function inicio(){
    buscaminas.numFilas=15;
    buscaminas.numColumnas=15;
    buscaminas.numMinasTot=15;
    pintarTablero();
    generarCampoMinasVacias();
    esparcirMinas();
    contarMinas();
    actualizarMinasRestantes();
}

window.onload = inicio;

