return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/widget_de_inicio/widget_de_inicio.js",
  "lib/vue2/componentes/no_reusables/widget_de_inicio", [

], async function () {
  return {
    name: "widget-de-inicio",
    templateUrl: "lib/vue2/componentes/no_reusables/widget_de_inicio/widget_de_inicio.xml",
    props: {
      datos: {
        type: Object,
        required: true,
      }
    },
    data() {
      this.$utilidades.tracear("widget_de_inicio.data");
      return {
        momento: new Date(),
        ahora_para_tiempo: new Date(),
        estan_subdatos_cargados: false,
        actividades_del_dia: [],
        tareas_seleccionadas_del_grafico: [],
        actividades_del_dia_fallidas: [],
        actividades_del_dia_pendientes: [],
        actividades_del_dia_cumplidas: [],
        estadisticas_de_actividades_del_dia: {},
        actividades_de_hora_actual: [],
        actividades_de_hora_siguiente: [],
        estado_actual: false,
        fenomenos_del_dia: [],
      }
    },
    watch: {

    },
    methods: {
      llenar_por_la_izquierda(texto, longitud = 2, relleno = "0") {
        let llenado = "" + texto;
        while (llenado.length < longitud) {
          llenado = relleno + llenado;
        }
        return llenado;
      },
      pasar_hora_a_texto(hora) {
        return this.llenar_por_la_izquierda(hora.hora, 2) + ":" + this.llenar_por_la_izquierda(hora.minuto, 2);
      },
      pasar_dia_a_texto(dia) {
        let salida = "";
        salida += dia.anyo;
        salida += "/";
        salida += this.llenar_por_la_izquierda(dia.mes, 2);
        salida += "/";
        salida += this.llenar_por_la_izquierda(dia.dia, 2);
        return salida;
      },
      pasar_duracion_a_texto(duracion) {
        let salida = "";
        if(duracion.dias) {
          salida += " " + duracion.dias + "d";
        }
        if(duracion.horas) {
          salida += " " + duracion.horas + "h";
        }
        if(duracion.minutos) {
          salida += " " + duracion.minutos + "min";
        }
        return salida.trim();
      },
      pasar_duracion_a_minutos(cantidad_de_tiempo) {
        let total_minutos = 0;
        try {
          total_minutos += cantidad_de_tiempo.dias ? cantidad_de_tiempo.dias * 60 * 24 : 0;
          total_minutos += cantidad_de_tiempo.horas ? cantidad_de_tiempo.horas * 60 : 0;
          total_minutos += cantidad_de_tiempo.minutos ? cantidad_de_tiempo.minutos : 0;
        } catch (error) {
          return 0;
        }
        return total_minutos;
      },
      normalizar_decimales(dec, numero) {
        return Math.round(numero).toFixed(dec);
      },
      obtener_subdatos() {
        this.estan_subdatos_cargados = false;
        this.obtener_actividades_del_dia();
        this.estan_subdatos_cargados = true;
        this.$forceUpdate(true);
      },
      obtener_actividades_del_dia() {
        let actividades = [];
        Obtenemos_actividades_del_dia: {
          Iterando_sentencias:
          for(let index=0; index<this.datos.sentencias.length; index++) {
            const sentencia = this.datos.sentencias[index];
            if(sentencia.tipo !== "sentencia de registrar fenómenos") {
              continue Iterando_sentencias;
            }
            if(sentencia.dia.anyo !== this.momento.getFullYear()) {
              continue Iterando_sentencias;
            }
            if(sentencia.dia.mes !== (this.momento.getMonth()+1)) {
              continue Iterando_sentencias;
            }
            if(sentencia.dia.dia !== this.momento.getDate()) {
              continue Iterando_sentencias;
            }
            actividades = actividades.concat(sentencia.registros);
          }
          this.actividades_del_dia = actividades;
        }
        Clasificamos_segun_el_estado: {
          for(let index=0; index<actividades.length; index++) {
            const actividad = actividades[index];
            if(actividad.estado === "-") {
              this.actividades_del_dia_fallidas.push(actividad);
            } else if(actividad.estado === "+") {
              this.actividades_del_dia_cumplidas.push(actividad);
            } else if(actividad.estado === "!") {
              this.actividades_del_dia_pendientes.push(actividad);
            } else if(actividad.estado === "") {
              this.actividades_del_dia_cumplidas.push(actividad);
            }
            Clasificamos_las_tareas_de_la_hora_actual: {
              const momento_inicio = new Date(this.momento);
              momento_inicio.setHours(actividad.hora.hora);
              momento_inicio.setMinutes(actividad.hora.minuto);
              const momento_final = new Date(momento_inicio);
              const duracion_en_minutos = (actividad.duracion.dias * 60 * 24) + (actividad.duracion.horas * 60) + (actividad.duracion.minutos);
              momento_final.setMinutes(momento_final.getMinutes() + duracion_en_minutos);
              const hora_inicio = new Date(this.momento);
              hora_inicio.setMinutes(0);
              const hora_final = new Date(hora_inicio);
              hora_final.setMinutes(59);
              const momento_inicio_esta_dentro = (momento_inicio >= hora_inicio) && (momento_inicio <= hora_final);
              const momento_final_esta_dentro = (momento_final >= hora_final) && (momento_inicio <= hora_final);
              const es_tarea_actual = momento_inicio_esta_dentro || momento_final_esta_dentro;
              if(es_tarea_actual) {
                this.actividades_de_hora_actual.push(actividad);
              }
            }
            Clasificamos_las_tareas_de_la_hora_siguiente: {
              const momento_inicio = new Date(this.momento);
              momento_inicio.setHours(actividad.hora.hora);
              momento_inicio.setMinutes(actividad.hora.minuto);
              const momento_final = new Date(momento_inicio);
              const duracion_en_minutos = (actividad.duracion.dias * 60 * 24) + (actividad.duracion.horas * 60) + (actividad.duracion.minutos);
              momento_final.setMinutes(momento_final.getMinutes() + duracion_en_minutos);
              const hora_inicio = new Date(this.momento);
              hora_inicio.setMinutes(0);
              hora_inicio.setHours(hora_inicio.getHours() + 1);
              const hora_final = new Date(hora_inicio);
              hora_final.setMinutes(59);
              hora_final.setHours(hora_final.getHours() + 1);
              const momento_inicio_esta_dentro = (momento_inicio >= hora_inicio) && (momento_inicio <= hora_final);
              const momento_final_esta_dentro = (momento_final >= hora_final) && (momento_inicio <= hora_final);
              const es_tarea_siguiente = momento_inicio_esta_dentro || momento_final_esta_dentro;
              if(es_tarea_siguiente) {
                this.actividades_de_hora_siguiente.push(actividad);
              }
            }
          }
        }
        Extraemos_los_porcentajes: {
          if(!this.actividades_del_dia.length) {
            this.estadisticas_de_actividades_del_dia = {
              porcentaje_de_tareas_cumplidas: 0,
              porcentaje_de_tareas_pendientes: 0,
              porcentaje_de_tareas_fallidas: 0,
            }
            break Extraemos_los_porcentajes;
          }
          const porcentaje_de_tareas_cumplidas = this.normalizar_decimales(0, (this.actividades_del_dia_cumplidas.length / this.actividades_del_dia.length) * 100);
          const porcentaje_de_tareas_pendientes = this.normalizar_decimales(0, (this.actividades_del_dia_pendientes.length / this.actividades_del_dia.length) * 100);
          const porcentaje_de_tareas_fallidas = this.normalizar_decimales(0, (this.actividades_del_dia_fallidas.length / this.actividades_del_dia.length) * 100);
          this.estadisticas_de_actividades_del_dia = {
            porcentaje_de_tareas_cumplidas: Number.isNaN(porcentaje_de_tareas_cumplidas) ? "-" : porcentaje_de_tareas_cumplidas,
            porcentaje_de_tareas_pendientes: Number.isNaN(porcentaje_de_tareas_pendientes) ? "-" : porcentaje_de_tareas_pendientes,
            porcentaje_de_tareas_fallidas: Number.isNaN(porcentaje_de_tareas_fallidas) ? "-" : porcentaje_de_tareas_fallidas,
          };
        }
        Extraemos_el_estado_actual: {
          this.estado_actual = this.datos.estados.ultimo;
        }
        Extraemos_los_fenomenos_del_dia: {
          const fenomenos = this.datos.fenomenos;
          const dia_actual = {anyo: this.momento.getFullYear(), mes: this.momento.getMonth()+1, dia: this.momento.getDate()};
          for(let index=0; index<fenomenos.length; index++) {
            const dato_fenomeno = fenomenos[index];
            const { fenomeno, duracion, dia, hora } = dato_fenomeno;
            if((dia.anyo === dia_actual.anyo) && (dia.mes === dia_actual.mes) && (dia.dia === dia_actual.dia)) {
              this.fenomenos_del_dia.push(dato_fenomeno);
            }
          }
        }
      },
      iniciar_tiempo() {
        this.temporizador = setInterval(() => {
          this.ahora_para_tiempo = new Date();
        }, 1000);
      },
      parar_tiempo() {
        this.temporizador = clearInterval(this.temporizador);
      },
      seleccionar_cumplidas_del_dia() {
        const pos = this.tareas_seleccionadas_del_grafico.indexOf("cumplidas");
        if(pos === -1) {
          this.tareas_seleccionadas_del_grafico.push("cumplidas");
        } else {
          this.tareas_seleccionadas_del_grafico.splice(pos, 1);
        }
      },
      seleccionar_fallidas_del_dia() {
        const pos = this.tareas_seleccionadas_del_grafico.indexOf("fallidas");
        if(pos === -1) {
          this.tareas_seleccionadas_del_grafico.push("fallidas");
        } else {
          this.tareas_seleccionadas_del_grafico.splice(pos, 1);
        }
      },
      seleccionar_pendientes_del_dia() {
        const pos = this.tareas_seleccionadas_del_grafico.indexOf("pendientes");
        if(pos === -1) {
          this.tareas_seleccionadas_del_grafico.push("pendientes");
        } else {
          this.tareas_seleccionadas_del_grafico.splice(pos, 1);
        }
      },
    },
    mounted() {
      this.obtener_subdatos();
      this.iniciar_tiempo();
    },
    unmount() {
      this.parar_tiempo();
    }
  };
});