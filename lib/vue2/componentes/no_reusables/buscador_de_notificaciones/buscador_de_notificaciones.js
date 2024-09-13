return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/buscador_de_notificaciones/buscador_de_notificaciones.js",
  "lib/vue2/componentes/no_reusables/buscador_de_notificaciones", [

], async function (mentemetria) {
  return {
    name: "buscador-de-notificaciones",
    templateUrl: "lib/vue2/componentes/no_reusables/buscador_de_notificaciones/buscador_de_notificaciones.xml",
    props: {
      estadisticas: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$utilidades.tracear("buscador_de_notificaciones.data");
      return {
        estado_de_filtro: "fabricado", // "fabricando" y "escribiendo" también posibles
        timeout_de_script_de_filtro: undefined,
        script_de_filtro: "",
        filtro: () => true,
        estado_de_busqueda: "no iniciada",
        notificaciones_filtradas: []
      }
    },
    watch: {
      script_de_filtro(value) {
        this.$utilidades.tracear("buscador_de_notificaciones.watch.script_de_filtro");
        this.estado_de_filtro = "escribiendo";
        clearTimeout(this.timeout_de_script_de_filtro);
        this.timeout_de_script_de_filtro = setTimeout(() => {
          this.estado_de_filtro = "fabricando";
          if (this.script_de_filtro.trim() !== "") {
            const codigo_de_filtro = `
              try {
                const item = arguments[0];
                const it = arguments[0];
                const index = arguments[1];
                const i = arguments[1];
                const list = arguments[2];
                const all = arguments[2];
                const component = arguments[3];
                return ${value};
              } catch(error) {
                return false;
              }
            `;
            try {
              const funcion_de_filtro = new Function(codigo_de_filtro);
              this.filtro = funcion_de_filtro;
            } catch (error) {
              this.estado_de_filtro = "erróneo";
            }
          } else {
            this.filtro = function () {
              return true;
            };
          }
          this.estado_de_filtro = "fabricado";
        }, 0);
      }
    },
    methods: {
      actualizar_valor_de_filtro(script_de_filtro) {
        this.$utilidades.tracear("buscador_de_notificaciones.watch.actualizar_valor_de_filtro");
        this.script_de_filtro = script_de_filtro;
      },
      cambiar_estado_de_busqueda(estado) {
        this.$utilidades.tracear("buscador_de_notificaciones.watch.cambiar_estado_de_busqueda");
        this.estado_de_busqueda = estado;
      },
      cargar_notificaciones() {
        this.$utilidades.tracear("buscador_de_notificaciones.watch.cargar_notificaciones");
        this.cambiar_estado_de_busqueda("buscando");
        const todas_las_notificaciones = this.estadisticas.root.interpretacion_de_script.notificaciones;
        const notificaciones_filtradas = [];
        for (let index_notificaciones = 0; index_notificaciones < todas_las_notificaciones.length; index_notificaciones++) {
          const notificacion = todas_las_notificaciones[index_notificaciones];
          const pasa_el_filtro = this.filtro(notificacion, index_notificaciones, todas_las_notificaciones, this);
          if (pasa_el_filtro) {
            notificaciones_filtradas.push(notificacion);
          }
        }
        this.notificaciones_filtradas = notificaciones_filtradas;
        this.cambiar_estado_de_busqueda("finalizada");
      }
    },
    mounted() {
        this.$utilidades.tracear("buscador_de_notificaciones.mounted");
        this.cargar_notificaciones();
    },
  };
});