return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_documentos/seccion_de_documentos.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "seccion-de-documentos",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_documentos/seccion_de_documentos.xml",
    props: {
      explorador: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$utilidades.tracear("seccion_de_documentos.data");
      return {}
    },
    methods: {
      subir_documento(documento_index) {
        return this.explorador.subir_documento(documento_index);
      },
      bajar_documento(documento_index) {
        return this.explorador.bajar_documento(documento_index);
      },
      confirmar_eliminar_documento(documento_index) {
        return this.explorador.confirmar_eliminar_documento(documento_index);
      },
      ir_a_documentos_de_documento(documento_index) {
        const componentes = this.$refs['subexplorador_' + documento_index];
        if(!componentes) {
          return;
        }
        const componente = componentes[0];
        if(!componente) {
          return;
        }
        componente.ir_a_seccion("documentos");
      },
      ir_a_reporte_de_documento(documento_index) {
        const componentes = this.$refs['subexplorador_' + documento_index];
        if(!componentes) {
          return;
        }
        const componente = componentes[0];
        if(!componente) {
          return;
        }
        componente.ir_a_seccion("reporte");
      }
    },
    mounted() {
      this.$utilidades.tracear("seccion_de_documentos.mounted");
    },
  };
});