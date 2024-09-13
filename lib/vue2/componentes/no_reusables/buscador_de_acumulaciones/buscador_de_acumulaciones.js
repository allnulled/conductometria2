return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/buscador_de_acumulaciones/buscador_de_acumulaciones.js",
  "lib/vue2/componentes/no_reusables/buscador_de_acumulaciones", [

], async function (mentemetria) {
  return {
    name: "buscador-de-acumulaciones",
    templateUrl: "lib/vue2/componentes/no_reusables/buscador_de_acumulaciones/buscador_de_acumulaciones.xml",
    props: {
      estadisticas: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$utilidades.tracear("buscador_de_acumulaciones.data");
      return {
        estado_de_filtro: "fabricado", // "fabricando" y "escribiendo" también posibles
        timeout_de_script_de_filtro: undefined,
        script_de_filtro: "",
        filtro: () => true,
        estado_de_busqueda: "no iniciada",
        acumulaciones_filtradas: []
      }
    },
    watch: {
      script_de_filtro(value) {
        this.$utilidades.tracear("buscador_de_acumulaciones.watch.script_de_filtro");
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
        this.$utilidades.tracear("buscador_de_acumulaciones.watch.actualizar_valor_de_filtro");
        this.script_de_filtro = script_de_filtro;
      },
      cambiar_estado_de_busqueda(estado) {
        this.$utilidades.tracear("buscador_de_acumulaciones.watch.cambiar_estado_de_busqueda");
        this.estado_de_busqueda = estado;
      },
      cargar_acumulaciones() {
        this.$utilidades.tracear("buscador_de_acumulaciones.watch.cargar_acumulaciones");
        this.cambiar_estado_de_busqueda("buscando");
        const todas_las_acumulaciones = this.estadisticas.root.interpretacion_de_script.acumulaciones;
        const todas_las_claves_de_acumulaciones = Object.keys(todas_las_acumulaciones);
        const acumulaciones_filtradas = [];
        for (let index_acumulaciones = 0; index_acumulaciones < todas_las_claves_de_acumulaciones.length; index_acumulaciones++) {
          const clave_de_acumulacion = todas_las_claves_de_acumulaciones[index_acumulaciones];
          const acumulacion = todas_las_acumulaciones[clave_de_acumulacion];
          const pasa_el_filtro = this.filtro(acumulacion, index_acumulaciones, todas_las_acumulaciones, this);
          if (pasa_el_filtro) {
            acumulaciones_filtradas.push(acumulacion);
          }
        }
        this.acumulaciones_filtradas = acumulaciones_filtradas;
        this.cambiar_estado_de_busqueda("finalizada");
      }
    },
    mounted() {
        this.$utilidades.tracear("buscador_de_acumulaciones.mounted");
        this.cargar_acumulaciones();
    },
  };
});