return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/personalizar_de_arbol/personalizar_de_arbol.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function () {
  return {
    name: "personalizar-de-arbol",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/personalizar_de_arbol/personalizar_de_arbol.xml",
    props: {
      explorador: {
        type: Object,
        required: true
      }
    },
    data() {
      this.$utilidades.tracear("personalizar_de_arbol.data");
      return {
        esta_cargando: true,
        nombre_del_reporte: "",
        modificador_del_reporte: "",
        reportador_del_reporte: "",
      }
    },
    watch: {},
    methods: {
      guardar_personalizar_reporte() {
        const nombre = this.$refs.nombre_del_reporte.value;
        const modificador = this.$refs.modificador_del_reporte.codigo;
        const reportador = this.$refs.reportador_del_reporte.codigo;
        // @TODO: persistiiiiiiiiiiiiiiir
        return this.explorador.guardar_personalizar_reporte(nombre, modificador, reportador);
      },
      cargar_personalizar_reporte() {
        this.esta_cargando = true;
        setTimeout(() => {
          const { nombre, modificador, reportador } = this.explorador.obtener_datos_de_reporte();
          this.nombre_del_reporte = nombre;
          this.modificador_del_reporte = modificador;
          this.reportador_del_reporte = reportador;
          this.esta_cargando = false;
        }, 10);
      }
    },
    mounted() {
      this.cargar_personalizar_reporte();
    },
  };
});