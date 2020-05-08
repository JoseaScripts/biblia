const JAG = {
  "version": "1.0",
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
