/***** PENDIENTE
 * Posibilidad de cambiar fuente si no se carga en un tiempo razonable
 * Añadir animación mientras se espera a que se descarge la biblia...
 * Poner nombres de los libros en español.
 * Añadir un enlace a los índices de los versículos para poder guardarlos en una base de datos con comentarios
 */
 const JAG = {
   "version": "1.1",
   "fuente": "biblia_es.json",
   "rvr": "https://raw.githubusercontent.com/camilacarvalho/Biblia---em-JSON/master/json/es_rvr.json",
   "kjv": "https://raw.githubusercontent.com/camilacarvalho/Biblia---em-JSON/master/json/en_kjv.json",
   "f_acentos": (cadena) => {
         return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
       },
     "log_arrayDeObjetos": (arr, cadena) => {
         console.log('array [', cadena, ']: ', arr);
      },
     "log_arrayDeObjetosLista": function (arr, cadena) {
         arr.forEach(item => {
           //console.log(`Objetos en array [${cadena}]: ${item}`)
           console.log('Objetos en array (', cadena , '):', item)
         })
       }
 }

let arrLibros = []
let biblia = []
let ver, num, consulta
const control = true
const debug = false
const bloque = false
const contenido =   document.getElementById('contenido')
const subtitulo = document.getElementById('subtitulo')
const resultado =document.getElementById('resultados')

// LISTA DE LIBROS ----------------------------------------------------
/** USO:
 *  Select de barra de navegación
 */
function f_listadoLibros() {
  Object.keys(biblia).forEach(item => {
    arrLibros.push([biblia[item].abbrev, biblia[item].name])
  })
  control ? console.log('Lista de libros creada [arrLibros]: ', arrLibros) : ''
  return arrLibros
}

// PARAMETROS ----------------------------------------------------------
function f_cargaURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if ( urlParams.get('consulta') ) {
    consulta = urlParams.get('consulta')
    control ? console.log('consulta: ', consulta) : ''
    f_resultadoConsulta(consulta)
    }
}
function f_resultadoConsulta(x) {
  let y = x.split(":")
  let l = y[0].length
  let cap = Number(y[1])
  ver = --y[2]

  let libro = f_filtraLibro(y[0])

  if (libro > 1) {
    control ? console.log('Error de filtrado, varios libros coinciden') : ''
    return 0
  // Búsqueda de una cadena, sin especificar libro -----------
  } else if (libro == 0) {
    control ? console.log('No se encontró ningún libro') : ''
    let arr = []
    let libros = []
    arrLibros.forEach(z => {
      let temp = f_resultadosBusqueda(z[0], x)
      temp.length > 0 ? libros.push([z[0], temp.length, z[1]]) : ''
      arr.push(...temp)
    })
    control ? JAG.log_arrayDeObjetosLista(libros, 'libros filtrados') : ''
    control ? JAG.log_arrayDeObjetos(arr, 'versos x libro') : ''
    subtitulo.innerHTML = `Búsqueda: ${consulta}`
    contenido.innerHTML = libros.map(p_busqueda_libros).join("");
    // ----------------------------------------------------
    // Búsqueda en un libro determinado -------------------
  } else if (typeof libro == 'object') {
    // gn y gn: pasa a tener cap = 1
    cap = (typeof y[1] == 'undefined') ? 1 : (cap == 0) ? 1 : cap
    if (isNaN(cap)) {
      console.log('NaN: ', y[1])
      f_cadenaEnLibro(libro, y[1])
    } else {
      control ? console.log('cap: ', cap) : ''
      f_consultaLibro(libro, cap)
    }
  }
}

// Busca libros a partir del primer elemento del array de búsqueda
function f_filtraLibro(x) {
  let libros = biblia.filter(function(objeto) {
    return objeto.abbrev == x;
  })
  bloque ? console.log('filtroLibros: ', libros) : ''
  if (libros.length === 0) return 0
  if (libros.length === 1) return libros[0]
  if (libros.length > 1) return 1
}

function f_resultadosBusqueda(z, x) {
  let arr = []
  // Lleva la cuenta de versículos con coincidencia con la búsqueda
  let a = 0
  let cap = 0
  let item = f_filtraLibro(z)
  bloque ? console.log('item: ', item) : ''
  item.chapters.forEach(capitulo => {
    cap++
    let cadenaLimpia = JAG.f_acentos(x).toLowerCase()
    for (let i = 0; i < capitulo.length; i++) {
      let capituloLimpio = JAG.f_acentos(capitulo[i]).toLowerCase()
      if (capituloLimpio.indexOf(cadenaLimpia) != -1) {
        arr.push( {
          "libro": item.name,
          "abrev": item.abbrev,
          "cap": cap,
          "vers": (1 + i),
          "texto": capitulo[i]
        })
        a++
      }
    }
  })
  bloque ? console.log('arr: ', arr) : ''
  return arr
}

function f_cadenaEnLibro(libro, cadena) {
  let arr = []
  let cap = 0
  libro.chapters.forEach(capitulo => {
    let cadenaLimpia = JAG.f_acentos(cadena).toLowerCase()
    cap++
    for (let i = 0; i < capitulo.length; i++) {
      let capituloLimpio = JAG.f_acentos(capitulo[i]).toLowerCase()
      if (capituloLimpio.indexOf(cadenaLimpia) != -1) {
        arr.push( {
          "libro": libro.name,
          "abrev": libro.abbrev,
          "cap": cap,
          "vers": (1 + i),
          "texto": capitulo[i]
        })
      }
    }
  })
  console.log('array de resultados: ', arr)
  f_imprimirResultados(cadena, arr)
}

function f_imprimirResultados(cadena, x){
  if (x.length > 0) {
    subtitulo.innerHTML = `Búsqueda: ${cadena}`
    contenido.innerHTML = x.map(p_busqueda).join("");
  } else {
    resultado.innerHTML = 'No se econtraron coincidencias.'
    contenido.innerHTML = `Búsqueda: ${cadena}`
  }
}

function f_consultaLibro(libro, cap) {
  // Reseteo de número de versículo
  num = 0
  --cap
  //--ver
  let capitulo = libro.chapters[cap]
  contenido.innerHTML = capitulo.map(p_versiculo).join("");
  subtitulo.innerHTML = libro.name
  resultado.innerHTML = `Capítulo ${cap + 1}`
  f_paginacion(libro.abbrev, libro.chapters.length, cap)
}

function f_paginacion(libro, num, cap) {
  // PAGINACIÓN
  let totalPaginas = num;
  let siguiente = document.getElementById('siguiente')
  let anterior = document.getElementById('anterior')
  anterior.innerHTML = '<button class="nav-item btn btn-info mx-1" type="button" name="button" id="b-anterior" onclick="f_resultadoConsulta(\'' + libro + ':' + cap + '\')">Capítulo ' + cap + '</button>';
  siguiente.innerHTML = '<button class="nav-item btn btn-info mx-1" type="button" name="button" id="b-siguiente" onclick="f_resultadoConsulta(\'' + libro + ':' + (cap + 2) + '\')">Capítulo ' + (cap + 2) + '</button>';
  // Oculta el botón 'anterior' si está en la página 1
  if (cap == 0) document.getElementById('b-anterior').classList.add("oculto");
  // Oculta el botón 'siguiente' si está en la última página
  if (cap == (totalPaginas - 1)) document.getElementById('b-siguiente').classList.add("oculto");
  control ? console.log('Total Capítulos: ', totalPaginas) : ''
}

function f_elementoSelect(array) {
  function plantilla_select (arr) {
    return `
      <option value="${arr[0]}">${arr[1]}</option>`;
  }
  let texto = array.map(plantilla_select).join('');

  let nav = document.getElementsByClassName('navbar-nav')[0]
  const x = document.createElement('select')
  x.setAttribute("name", "selectorLibros")
  x.setAttribute("onchange", "f_seleccionLibro()")
  x.classList.add("btn", "btn-info")
  x.innerHTML = texto
  nav.appendChild(x)
}

function f_seleccionLibro() {
  const v = document.getElementById('tema').value
  const x = document.getElementsByName("selectorLibros")[0].value
  console.log('valorSelect: ', x)
  if (v) {
    f_resultadoConsulta(x + ':' + v)
  } else {
  document.getElementById('tema').value = `${x}:`
  document.getElementById('tema').focus()
  }
}

function f_inicio () {
   var req = new Request(JAG.rvr);
   fetch(req)
   .then(res => res.json())
   .then(objeto => {
     biblia = objeto;
     control ? console.log('cargando: ', biblia) : ''
   })
   .then(funciones => {
    arrLibros = f_listadoLibros()
    f_cargaURL()
    f_elementoSelect(arrLibros)
    control ? console.log('inicio finalizado') : ''
   })
}

// PLANTILLAS ----------------------------------------------------------------
// PLANTILLA BUSQUEDAS -------------------------------------------------------
/**** PENDIENTE
 * Fusionar las dos primeras plantillas
 * Crear un array de arrays con los elementos editados para encajar perfectamente
 */
function p_busqueda(x) {
  return `
  <article class="card bg-transparent border-primary my-2">
    <header class="card-header">${x.libro}</header>
    <div class="card-body text-left pt-0">
      <small class="text-muted">${x.abrev}:${x.cap}: ${x.vers}</small>
      <div class="card-text pt-3">${x.texto}</div>
      <footer class="card-footer">
<!--        <a href="#" class="btn btn-block bg-info text-light stretched-link">+ info</a> -->
        <button class="btn btn-block bg-info text-light stretched-link" onclick="f_resultadoConsulta('${x.abrev}:${x.cap}:${x.vers}')">Capítulo completo</button>
      </footer>
    </div>
  </article>`;
}
// PENDINTE:
// Fusionar las dos plantillas.
// OBSERVACIÓN:
// El enlace funciona, pero obliga a descargar la biblia de nuevo.
function p_busqueda_libros(x) {
  return `
  <article class="card bg-transparent border-primary my-2">
    <header class="card-header">${x[2]}</header>
    <div class="card-body text-left pt-0">
      <small class="text-muted">${x[0]}:</small>
      <div class="card-text pt-3">Encontrados ${x[1]} versos con coincidencias.</div>
      <footer class="card-footer">
        <button class="btn btn-block bg-info text-light stretched-link" onclick="f_resultadoConsulta('${x[0]}:${consulta}')">Ver Versículos</button>
<!--       <a href="/biblia/?consulta=${x[0]}:${consulta}" class="btn btn-block bg-info text-light stretched-link">+ info</a> -->
      </footer>
    </div>
  </article>`;
}
// PLANTILLA VERSÍCULOS-------------------------------------------------------
function p_versiculo(fuente) {
  if (ver == num) {
      cadena = `<mark>${fuente}</mark>`
  } else {
      cadena = `${fuente}`
  }
  return `
  <sup>${++num}</sup>${cadena}`;
}
