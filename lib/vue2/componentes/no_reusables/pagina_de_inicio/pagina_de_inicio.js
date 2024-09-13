return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/pagina_de_inicio/pagina_de_inicio.js",
  "lib/vue2/componentes/no_reusables/pagina_de_inicio", [

], async function (mentemetria) {
  return {
    name: "pagina-de-inicio",
    templateUrl: "lib/vue2/componentes/no_reusables/pagina_de_inicio/pagina_de_inicio.xml",
    data() {
      this.$utilidades.tracear("pagina_de_inicio.data");
      return {
        Sistema_de_dialogos: window.Sistema_de_dialogos,
        seccion_seleccionada: "editor",
        id_timeout_de_script: undefined,
        contenido_de_script: "",
        estado_de_script: "editando", // "esperando" / "corrigiendo"
        interpretacion_de_script: undefined,
        posicion_del_cursor: undefined,
        id_timeout_de_actualizar_cursor: undefined,
        estado_de_script: "corregido",
        error_de_script: false,
        tamanio_de_texto: 12,
        familia_de_texto: "normal",
      }
    },
    watch: {

    },
    methods: {
      seleccionar_seccion(seccion) {
        this.$utilidades.tracear("pagina_de_inicio.methods.seleccionar_seccion");
        this.seccion_seleccionada = seccion;
      },
      ir_a_editor() {
        this.seleccionar_seccion("editor");
        this.$refs.entrada_de_codigo_1.focus();
      },
      ir_a_estadisticas() {
        this.seleccionar_seccion("estadísticas");
      },
      parsear_script_con_dilacion() {
        this.$utilidades.tracear("pagina_de_inicio.methods.parsear_script_con_dilacion");
        this.actualizar_posicion_del_cursor();
        this.estado_de_script = "corrigiendo";
        clearTimeout(this.id_timeout_de_script);
        this.id_timeout_de_script = setTimeout(this.parsear_script, 2000);
      },
      parsear_script() {
        this.$utilidades.tracear("pagina_de_inicio.methods.parsear_script");
        try {
          this.interpretacion_de_script = undefined;
          const contenido = this.contenido_de_script;
          const ast = this.$window.conductometria2.parse(contenido);
          const interpretacion = this.$window.conductometria2_api.interpretar_ast(ast);
          this.interpretacion_de_script = interpretacion.pasar_a_objeto_plano();
          this.guardar_script();
          this.estado_de_script = "corregido";
        } catch (error) {
          this.estado_de_script = "erroneo";
          this.error_de_script = error;
        }
      },
      guardar_script() {
        this.$utilidades.tracear("pagina_de_inicio.methods.guardar_script");
        localStorage.conductometria2_script_inicial = this.contenido_de_script;
      },
      cargar_script() {
        this.$utilidades.tracear("pagina_de_inicio.methods.cargar_script");
        this.contenido_de_script = localStorage.conductometria2_script_inicial;
        this.parsear_script();
      },
      actualizar_posicion_del_cursor() {
        this.$utilidades.tracear("pagina_de_inicio.methods.cargar_script");
        this.$window.clearTimeout(this.id_timeout_de_actualizar_cursor);
        this.id_timeout_de_actualizar_cursor = this.$window.setTimeout(() => {
          const entrada_de_codigo = this.$refs.entrada_de_codigo_1;
          const codigo = entrada_de_codigo.value;
          const posicion_inicio = entrada_de_codigo.selectionStart;
          const posicion_fin = entrada_de_codigo.selectionEnd;
          const direccion = entrada_de_codigo.selectionDirection;
          let linea = 1, columna = 1;
          const coordenadas = { inicio: { linea: 0, columna: 0, posicion: 0 }, fin: { linea: 0, columna: 0, posicion: 0 } };
          Sacando_posicion_segun_linea_y_columna:
          for(let index=0; index<=codigo.length; index++) {
            const caracter = codigo[index];
            if(index === posicion_inicio) {
              coordenadas.inicio = { linea, columna, posicion: index };
            }
            if(index === posicion_fin) {
              coordenadas.fin = { linea, columna, posicion: index };
            }
            if(caracter === "\n") {
              linea++;
              columna = 1;
            } else {
              columna++;
            }
          }
          this.posicion_del_cursor = {
            ...coordenadas,
            direccion
          };
        }, 100);
      },
      ir_a_error() {
        this.$utilidades.tracear("pagina_de_inicio.methods.ir_a_error");
        const entrada_de_codigo_1 = this.$refs.entrada_de_codigo_1;
        entrada_de_codigo_1.setSelectionRange(this.error_de_script.location.start.offset, this.error_de_script.location.end.offset);
        entrada_de_codigo_1.focus();
      },
      mostrar_error() {
        this.$utilidades.tracear("pagina_de_inicio.methods.mostrar_error");
        this.$window.document.querySelector("#dialogo_de_error_de_script").show();
      },
      cerrar_error() {
        this.$utilidades.tracear("pagina_de_inicio.methods.cerrar_error");
        this.$window.document.querySelector("#dialogo_de_error_de_script").close();
      },
      minimizar_texto() {
        this.$utilidades.tracear("pagina_de_inicio.methods.minimizar_texto");
        this.tamanio_de_texto--;
        this.$refs.entrada_de_codigo_1.style.fontSize = this.tamanio_de_texto + "px";
      },
      maximizar_texto() {
        this.$utilidades.tracear("pagina_de_inicio.methods.maximizar_texto");
        this.tamanio_de_texto++;
        this.$refs.entrada_de_codigo_1.style.fontSize = this.tamanio_de_texto + "px";
      },
      alternar_familia_de_texto() {
        this.$utilidades.tracear("pagina_de_inicio.methods.alternar_familia_de_texto");
        const es_monoespaciado = this.familia_de_texto === "monoespaciado";
        if(es_monoespaciado) {
          this.familia_de_texto = "normal";
          this.$refs.entrada_de_codigo_1.style.fontFamily = "Roboto";
        } else {
          this.familia_de_texto = "monoespaciado";
          this.$refs.entrada_de_codigo_1.style.fontFamily = "monospace";
        }
      }
    },
    mounted() {
        this.$utilidades.tracear("pagina_de_inicio.mounted");
        this.cargar_script();
    },
  };
});