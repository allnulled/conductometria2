return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/pagina_de_estadisticas/pagina_de_estadisticas.js",
  "lib/vue2/componentes/no_reusables/pagina_de_estadisticas", [

], async function () {
  return {
    name: "pagina-de-estadisticas",
    templateUrl: "lib/vue2/componentes/no_reusables/pagina_de_estadisticas/pagina_de_estadisticas.xml",
    props: {
      root: {
        type: Object,
        required: true
      }
    },
    data() {
      console.log("[TRACE:pagina_de_estadisticas.data]");
      return {
        esta_cargando_subseccion: false,
        subseccion_seleccionada: 'buscar notificaciones'
      }
    },
    watch: {

    },
    methods: {
      ir_a_subseccion(subseccion) {
        this.esta_cargando_subseccion = true;
        this.subseccion_seleccionada = subseccion;
        this.$forceUpdate(true);
        setTimeout(() => {
          this.esta_cargando_subseccion = false;
          this.$forceUpdate(true);
        });
      }
    },
    mounted() {
      //console.log(this.root.interpretacion_de_script);
    },
  };
});