return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/explorador_de_arbol/explorador_de_arbol.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "explorador-de-arbol",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/explorador_de_arbol/explorador_de_arbol.xml",
    props: {
      nodoPadre: {
        type: Object,
        default: () => undefined
      },
      baseDeDatosDeReportes: {
        type: String,
        required: true
      },
      datosBase: {
        type: Object,
        required: true
      },
      exploradorRaiz: {
        type: Object,
        required: false
      }
    },
    data() {
      this.$utilidades.tracear("explorador_de_arbol.data");
      return {
        explorador_raiz: this.exploradorRaiz || this,
        datos_raiz: this.datosBase || undefined,
        esta_cargando_seccion: true,
        seccion_seleccionada: "reporte",
        seccion_de_documentos: {},
        seccion_de_visualizador: {},
        seccion_de_fuente: {},
        seccion_de_constructor_de_documento: {}
      }
    },
    watch: {},
    methods: {
      ir_a_seccion(seccion) {
        this.seccion_seleccionada = undefined;
        this.esta_cargando_seccion = true;
        this.seccion_seleccionada = seccion;
        setTimeout(() => {
          this.cargar_seccion(seccion).then(() => {
              this.esta_cargando_seccion = false;
          });
        }, 100);
      },
      cargar_seccion(seccion) {
        let hecho = undefined;
        const promesa = new Promise(function(ok, fail) {
          hecho = ok;
        });
        this["cargar_seccion_de_" + seccion.replaceAll(" ", "_")].call(this, hecho, promesa);
        return promesa;
      },
      cargar_seccion_de_documentos(hecho) {
        hecho();
      },
      cargar_seccion_de_visualizador(hecho) {
        hecho();
      },
      cargar_seccion_de_fuente(hecho) {
        hecho();
      },
      cargar_seccion_de_constructor_de_documento(hecho) {
        hecho();
      },
      cargar_seccion_de_reporte(hecho) {
        this.cargar_datos_raiz();
        hecho();
      },
      cargar_seccion_de_personalizar(hecho) {
        hecho();
      },
      cargar_datos_raiz() {
        const database_id = this.explorador_raiz.baseDeDatosDeReportes;
        delete localStorage[database_id];
        if(!(database_id in localStorage)) {
          localStorage[database_id] = JSON.stringify({
            nombre: null,
            reporte: {
              reportador: "// función js que da datos y definiciones de interfaz"
            },
            documentos: []
          });
        }
        this.explorador_raiz.datos_raiz = JSON.parse(localStorage[database_id]);
        return this.explorador_raiz.datos_raiz;
      },
      guardar_datos_raiz(datos) {
        localStorage[database_id] = JSON.stringify(datos);
        this.cargar_datos_raiz();
      }
    },
    mounted() {
      this.ir_a_seccion("reporte");
    },
  };
});