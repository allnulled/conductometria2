return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/documentos_de_arbol/documentos_de_arbol.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "documentos-de-arbol",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/documentos_de_arbol/documentos_de_arbol.xml",
    props: {
      explorador: {
        type: Object,
        required: true
      }
    },
    data() {
      this.$utilidades.tracear("documentos_de_arbol.data");
      return {
        esta_cargando: true,
        documentos: undefined,
        documentos_expandidos: []
      }
    },
    watch: {},
    methods: {
      cargar_documentos() {
        this.esta_cargando = true;
        setTimeout(() => {
          this.documentos = this.explorador.obtener_documentos();
          this.esta_cargando = false;
        }, 50);
      },
      aniadir_documento() {
        return this.explorador.aniadir_documento();
      },
      alternar_expansion_de_documento(uuid) {
        const posicion = this.documentos_expandidos.indexOf(uuid);
        if(posicion === -1) {
          this.documentos_expandidos.push(uuid);
        } else {
          this.documentos_expandidos.splice(posicion, 1);
        }
      },
      subir_documento(indice_de_documento) {
        return this.explorador.subir_documento(indice_de_documento);
      },
      bajar_documento(indice_de_documento) {
        return this.explorador.bajar_documento(indice_de_documento);
      },
      eliminar_documento(indice_de_documento) {
        return this.explorador.eliminar_documento(indice_de_documento);
      },
      volver_a_reporte() {
        this.explorador.ir_a_seccion("reporte");
      }
    },
    mounted() {
      this.cargar_documentos();
    },
  };
});