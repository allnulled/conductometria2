return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/visualizador_de_nodo/visualizador_de_nodo.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "visualizador-de-nodo",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/visualizador_de_nodo/visualizador_de_nodo.xml",
    props: {
      propiedad: {
        type: String,
        required: true
      },
      dato: {
        type: [Object, Array, String, Number, Boolean, Function],
        required: false
      },
      esRaiz: {
        type: Boolean,
        default: () => false
      }
    },
    data() {
      this.$utilidades.tracear("visualizador_de_nodo.data");
      return {
        esta_contraido: false
      }
    },
    watch: {},
    methods: {
      alternar_dato() {
        this.esta_contraido = !this.esta_contraido;
      },
      contraer_dato() {
        this.esta_contraido = true;
      },
      expandir_dato() {
        this.esta_contraido = false;
      },
      contraer_subdatos() {
        let indice = 0;
        while(("subnodo_" + indice) in this.$refs) {
          const subcomponente = this.$refs["subnodo_" + indice][0];
          console.log(subcomponente);
          subcomponente.contraer_dato();
          indice++;
        }
      },
      expandir_subdatos() {
        let indice = 0;
        while(("subnodo_" + indice) in this.$refs) {
          const subcomponente = this.$refs["subnodo_" + indice][0];
          console.log(subcomponente);
          subcomponente.expandir_dato();
          indice++;
        }
      }
    },
    mounted() {},
  };
});