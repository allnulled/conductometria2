return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_reporte/seccion_de_reporte.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "seccion-de-reporte",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_reporte/seccion_de_reporte.xml",
    props: {
      explorador: {
        type: Object,
        required: true,
      },
    },
    data() {
      this.$utilidades.tracear("seccion_de_reporte.data");
      return {
        esta_cargando: true,
        error_de_reporte: undefined
      }
    },
    methods: {
      eliminar_error() {
        this.error_de_reporte = undefined;
      },
      async cargar_reporte() {
        try {
          this.esta_cargando = true;
          const parametros = this.explorador.datos_base_modificados;
          const entrada_de_nombre = this.explorador.generar_uuid(20, true);
          const nombre_de_reporte = this.explorador.datos_de_reportes_relativos.nombre;
          const entrada_de_plantilla = this.explorador.datos_de_reportes_relativos.plantilla;
          const entrada_de_componente = this.explorador.datos_de_reportes_relativos.componente;
          let codigo_de_plantilla = "";
          codigo_de_plantilla += "<div>\n";
          codigo_de_plantilla += "El reporte de <b style='font-weight: bold;'>«{{ explorador.datos_de_reportes_relativos.nombre }}»</b> no tiene plantilla actualmente.\n";
          codigo_de_plantilla += "</div>\n";
          if(entrada_de_plantilla.trim() !== "") {
            codigo_de_plantilla = "<div>\n";
            codigo_de_plantilla += entrada_de_plantilla;
            codigo_de_plantilla += "\n</div>";
          }
          let codigo_de_componente = "(async function() { return; })()";
          if(entrada_de_componente.trim() !== "") {
            codigo_de_componente = "(async function(reporte, parametros) {\n";
            codigo_de_componente += "  try {\n";
            codigo_de_componente += "    " + entrada_de_componente + "\n";
            codigo_de_componente += "  } catch(error) {\n";
            codigo_de_componente += "    error.message = '[seccion_de_reporte.cargar_reporte] [' + nombre_de_reporte + '] ' + error.message;\n";
            codigo_de_componente += "    console.log(error);\n";
            codigo_de_componente += "    throw error;\n";
            codigo_de_componente += "  }\n";
            codigo_de_componente += "}).call(this, this.explorador.datos_de_reportes_relativos, parametros)\n";
          }
          const parametros_de_componente_sucio = await eval(codigo_de_componente);
          const seccion_de_reporte = this;
          const parametros_de_componente_estandar = {
            name: entrada_de_nombre,
            props: {
              explorador: {
                type: Object,
                required: true,
              },
              seccionDeReporte: {
                type: Object,
                required: true,
              }
            },
            data() {
              return {
                seccion_de_reporte: this.seccionDeReporte,
                datos: parametros
              }
            },
            methods: {},
            watch: {},
            mounted() {},
          };
          const parametros_de_componente = typeof parametros_de_componente_sucio === "undefined" ? parametros_de_componente_estandar : parametros_de_componente_sucio;
          Object.assign(parametros_de_componente, {
            template: codigo_de_plantilla
          });
          this.$window.Vue.component(entrada_de_nombre, parametros_de_componente);
          this.nombre_de_componente = entrada_de_nombre;
          this.esta_cargando = false;
        } catch (error) {
          console.log(error);
          this.error_de_reporte = error;
          this.esta_cargando = false;
        }
      }
    },
    mounted() {
      this.$utilidades.tracear("seccion_de_reporte.mounted");
      this.cargar_reporte();
    },
  };
});