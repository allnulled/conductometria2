return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_codigo/seccion_de_codigo.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "seccion-de-codigo",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_codigo/seccion_de_codigo.xml",
    props: {
      explorador: {
        type: Object,
        required: true,
      },
    },
    data() {
      this.$utilidades.tracear("seccion_de_codigo.data");
      return {
        
      }
    },
    methods: {

    },
    mounted() {
      this.$utilidades.tracear("seccion_de_codigo.mounted");
    },
  };
});