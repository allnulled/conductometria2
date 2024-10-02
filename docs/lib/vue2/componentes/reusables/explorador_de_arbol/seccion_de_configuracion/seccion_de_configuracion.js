return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_configuracion/seccion_de_configuracion.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "seccion-de-configuracion",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/seccion_de_configuracion/seccion_de_configuracion.xml",
    props: {
      explorador: {
        type: Object,
        required: true,
      },
    },
    data() {
      this.$utilidades.tracear("seccion_de_configuracion.data");
      return {
        panel_seleccionado: "", // "importar", "exportar", ""
        metadatos_de_reporte: this.explorador.datos_de_reportes_relativos,
        texto_de_importar: "",
        texto_de_exportar: "",
      }
    },
    methods: {
      guardar_metadatos_de_reportes_relativos() {
        this.$utilidades.tracear("seccion_de_configuracion.guardar_metadatos_de_reportes_relativos");
        const nombre = this.$refs.nombre_de_reporte.value;
        const modificador = this.$refs.modificador_de_reporte.value;
        const plantilla = this.$refs.plantilla_de_reporte.value;
        const componente = this.$refs.componente_de_reporte.value;
        return this.explorador.guardar_metadatos_de_reportes_relativos(nombre, modificador, plantilla, componente).then(() => {
          this.explorador.ir_a_seccion("configuracion");
        });
      },
      confirmar_resetear_reportes() {
        this.panel_seleccionado = "";
        return this.explorador.explorador_raiz.confirmar_resetear_reportes();
      },
      alternar_panel_de_importar_reportes() {
        if(this.panel_seleccionado === "importar_reportes") {
          this.panel_seleccionado = "";
        } else {
          this.panel_seleccionado = "importar_reportes";
        }
      },
      alternar_panel_de_exportar_reportes() {
        if(this.panel_seleccionado === "exportar_reportes") {
          this.panel_seleccionado = "";
        } else {
          const reportes = JSON.stringify(this.explorador.explorador_raiz.datos_de_reportes_absolutos, null, 2);
          this.texto_de_exportar = reportes;
          this.panel_seleccionado = "exportar_reportes";
        }
      },
      confirmar_importar_reportes() {
        return this.explorador.explorador_raiz.confirmar_importar_reportes(this.texto_de_importar, this);
      },
      copiar_texto_de_exportar_reportes() {
        navigator.clipboard.writeText(this.texto_de_exportar);
        this.panel_seleccionado = "";
      },
      cancelar_importar_reportes() {
        this.panel_seleccionado = "";
      },
    },
    mounted() {
      this.$utilidades.tracear("seccion_de_configuracion.mounted");
    },
  };
});