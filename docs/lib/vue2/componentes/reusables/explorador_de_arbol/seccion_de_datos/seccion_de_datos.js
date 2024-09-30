return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_datos/seccion_de_datos.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "seccion-de-datos",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_datos/seccion_de_datos.xml",
    props: {
      explorador: {
        type: Object,
        required: true,
      },
    },
    data() {
      this.$utilidades.tracear("seccion_de_datos.data");
      return {
        
      }
    },
    methods: {

    },
    mounted() {
      this.$utilidades.tracear("seccion_de_datos.mounted");
    },
  };
});