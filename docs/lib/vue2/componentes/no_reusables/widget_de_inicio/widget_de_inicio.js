return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/widget_de_inicio/widget_de_inicio.js",
  "lib/vue2/componentes/no_reusables/widget_de_inicio", [

], async function () {
  return {
    name: "widget-de-inicio",
    templateUrl: "lib/vue2/componentes/no_reusables/widget_de_inicio/widget_de_inicio.xml",
    props: {
      datos: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$utilidades.tracear("widget_de_inicio.data");
      return {
        
      }
    },
    watch: {

    },
    methods: {
      
    },
    mounted() {
      
    },
  };
});