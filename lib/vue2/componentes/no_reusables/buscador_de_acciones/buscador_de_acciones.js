return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/buscador_de_acciones/buscador_de_acciones.js",
  "lib/vue2/componentes/no_reusables/buscador_de_acciones", [

], async function (mentemetria) {
  return {
    name: "buscador-de-acciones",
    templateUrl: "lib/vue2/componentes/no_reusables/buscador_de_acciones/buscador_de_acciones.xml",
    props: {
      estadisticas: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$utilidades.tracear("buscador_de_acciones.data");
      return {
        estado_de_filtro: "fabricado", // "fabricando" y "escribiendo" también posibles
        timeout_de_script_de_filtro: undefined,
        script_de_filtro: "",
        filtro: () => true,
        estado_de_busqueda: "no iniciada",
        acciones_filtradas: []
      }
    },
    watch: {
      script_de_filtro(value) {
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
        this.script_de_filtro = script_de_filtro;
      },
      cambiar_estado_de_busqueda(estado) {
        this.estado_de_busqueda = estado;
      },
      cargar_acciones() {
        this.cambiar_estado_de_busqueda("buscando");
        const todas_las_acciones = this.estadisticas.root.interpretacion_de_script.acciones;
        const acciones_filtradas = [];
        for (let index_acciones = 0; index_acciones < todas_las_acciones.length; index_acciones++) {
          const accion = todas_las_acciones[index_acciones];
          const pasa_el_filtro = this.filtro(accion, index_acciones, todas_las_acciones, this);
          if (pasa_el_filtro) {
            acciones_filtradas.push(accion);
          }
        }
        this.acciones_filtradas = acciones_filtradas;
        this.cambiar_estado_de_busqueda("finalizada");
      }
    },
    mounted() {
      this.cargar_acciones();
    },
  };
});