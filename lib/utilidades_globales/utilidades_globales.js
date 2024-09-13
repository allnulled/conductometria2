Sistema_de_modulos.definir("lib/utilidades_globales", [], function () {
  const utilidades_globales = {
    memoria_global: {
      indice_de_traceos: 0
    }
  };
  utilidades_globales.tracear = function(mensaje) {
    const indice = ++utilidades_globales.memoria_global.indice_de_traceos;
    console.log("[TRACE] [global] [nº" + indice + "] " + mensaje);
  };
  window.utilidades_globales = utilidades_globales;
  return utilidades_globales;
});