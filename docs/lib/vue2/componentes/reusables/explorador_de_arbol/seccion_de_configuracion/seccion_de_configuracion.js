return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_configuracion/seccion_de_configuracion.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "seccion-de-configuracion",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_configuracion/seccion_de_configuracion.xml",
    props: {
      explorador: {
        type: Object,
        required: true,
      },
    },
    data() {
      this.$utilidades.tracear("seccion_de_configuracion.data");
      return {
        metadatos_de_reporte: this.explorador.datos_de_reportes_relativos
      }
    },
    methods: {
      guardar_metadatos_de_reportes_relativos() {
        this.$utilidades.tracear("seccion_de_configuracion.guardar_metadatos_de_reportes_relativos");
        console.log(this.$refs);
        const nombre = this.$refs.nombre_de_reporte.value;
        const modificador = this.$refs.modificador_de_reporte.value;
        const plantilla = this.$refs.plantilla_de_reporte.value;
        const componente = this.$refs.componente_de_reporte.value;
        return this.explorador.guardar_metadatos_de_reportes_relativos(nombre, modificador, plantilla, componente).then(() => {
          this.explorador.ir_a_seccion("configuracion");
        });
      }
    },
    mounted() {
      this.$utilidades.tracear("seccion_de_configuracion.mounted");
    },
  };
});