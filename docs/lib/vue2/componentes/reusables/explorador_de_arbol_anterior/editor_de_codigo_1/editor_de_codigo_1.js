return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/editor_de_codigo_1/editor_de_codigo_1.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "editor-de-codigo-1",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/editor_de_codigo_1/editor_de_codigo_1.xml",
    props: {
      explorador: {
        type: Object,
        required: true
      },
      codigoInicial: {
        type: String,
        required: true
      },
      modo: {
        type: String,
        required: true
      }
    },
    data() {
      this.$utilidades.tracear("editor_de_codigo_1.data");
      return {
        codigo: this.codigoInicial,
        tamanio_de_fuente: 12
      }
    },
    watch: {},
    methods: {
      cambiar_tipo_de_fuente() {
        if(this.$refs.editor_de_codigo.style.fontFamily === "monospace") {
          this.$refs.editor_de_codigo.style.fontFamily = "Arial";
        } else {
          this.$refs.editor_de_codigo.style.fontFamily = "monospace";
        }
      },
      decrementar_tamanio_de_fuente() {
        this.$refs.editor_de_codigo.style.fontSize = (--this.tamanio_de_fuente) + "px";
      },
      incrementar_tamanio_de_fuente() {
        this.$refs.editor_de_codigo.style.fontSize = (++this.tamanio_de_fuente) + "px";
      }
    },
    mounted() {},
  };
});