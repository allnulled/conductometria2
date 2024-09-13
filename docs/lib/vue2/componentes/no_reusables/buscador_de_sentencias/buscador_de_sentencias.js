return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/buscador_de_sentencias/buscador_de_sentencias.js",
  "lib/vue2/componentes/no_reusables/buscador_de_sentencias", [

], async function (mentemetria) {
  return {
    name: "buscador-de-sentencias",
    templateUrl: "lib/vue2/componentes/no_reusables/buscador_de_sentencias/buscador_de_sentencias.xml",
    props: {
      estadisticas: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$utilidades.tracear("buscador_de_sentencias.data");
      return {
        estado_de_filtro: "fabricado", // "fabricando" y "escribiendo" también posibles
        timeout_de_script_de_filtro: undefined,
        script_de_filtro: "",
        filtro: () => true,
        estado_de_busqueda: "no iniciada",
        sentencias_filtradas: []
      }
    },
    watch: {
      script_de_filtro(value) {
        this.$utilidades.tracear("buscador_de_sentencias.watch.script_de_filtro");
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
        this.$utilidades.tracear("buscador_de_sentencias.watch.actualizar_valor_de_filtro");
        this.script_de_filtro = script_de_filtro;
      },
      cambiar_estado_de_busqueda(estado) {
        this.$utilidades.tracear("buscador_de_sentencias.watch.cambiar_estado_de_busqueda");
        this.estado_de_busqueda = estado;
      },
      cargar_sentencias() {
        this.$utilidades.tracear("buscador_de_sentencias.watch.cargar_sentencias");
        this.cambiar_estado_de_busqueda("buscando");
        const todas_las_sentencias = this.estadisticas.root.interpretacion_de_script.sentencias;
        const sentencias_filtradas = [];
        for (let index_sentencias = 0; index_sentencias < todas_las_sentencias.length; index_sentencias++) {
          const sentencia = todas_las_sentencias[index_sentencias];
          const pasa_el_filtro = this.filtro(sentencia, index_sentencias, todas_las_sentencias, this);
          if (pasa_el_filtro) {
            sentencias_filtradas.push(sentencia);
          }
        }
        this.sentencias_filtradas = sentencias_filtradas;
        this.cambiar_estado_de_busqueda("finalizada");
      }
    },
    mounted() {
        this.$utilidades.tracear("buscador_de_sentencias.mounted");
        this.cargar_sentencias();
    },
  };
});