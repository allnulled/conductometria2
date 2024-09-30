return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/reporte_de_arbol/reporte_de_arbol.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function () {
  return {
    name: "reporte-de-arbol",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/reporte_de_arbol/reporte_de_arbol.xml",
    props: {
      explorador: {
        type: Object,
        required: true
      }
    },
    data() {
      this.$utilidades.tracear("reporte_de_arbol.data");
      return {}
    },
    watch: {},
    methods: {},
    mounted() {},
  };
});