(function (api) {
  const mod = api();
  if (typeof window !== "undefined") {
    window.conductometria2_api = mod;
  }
  if (typeof global !== "undefined") {
    global.conductometria2_api = mod;
  }
  if (typeof module !== "undefined") {
    module.exports = mod;
  }
})(function () {

  const Interpretacion_de_ast = class {

    opciones = {
      trace: true
    };

    die(...msgs) {
      this.log(...msgs);
      process.exit(0);
    }

    log(...msgs) {
      for (let index = 0; index < msgs.length; index++) {
        const msg = msgs[index];
        if (typeof msg === "string") {
          console.log(msg);
        } else {
          console.log(JSON.stringify(msg, null, 2));
        }
      }
    }

    traceos = 0;

    trace(id, argumentos) {
      if (!this.opciones.trace) {
        return;
      }
      console.log("[TRACE] [conductometria2_api] [nº" + this.traceos + "] " + id + " (" + argumentos.length + ")");
      this.traceos++;
    }

    printar_traceos() {
      for (let index = 0; index < this.traceos.length; index++) {
        const traceo = this.traceos[index];
        console.log(index + ":" + traceo);
      }
    }

    constructor(ast, opciones = {}) {
      this.trace("interpretacion_de_ast.constructor", arguments);
      this.ast_original = ast;
      this.opciones = Object.assign(this.opciones, opciones);
      this.cargar_interpretacion();
    }

    pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo) {
      this.trace("interpretacion_de_ast.pasar_de_cantidad_de_tiempo_a_minutos", arguments);
      let total_minutos = 0;
      try {
        total_minutos += cantidad_de_tiempo.dias ? cantidad_de_tiempo.dias * 60 * 24 : 0;
        total_minutos += cantidad_de_tiempo.horas ? cantidad_de_tiempo.horas * 60 : 0;
        total_minutos += cantidad_de_tiempo.minutos ? cantidad_de_tiempo.minutos : 0;
      } catch (error) {
        return 0;
      }
      return total_minutos;
    }

    pasar_minutos_a_cantidad_de_tiempo(minutos_originales) {
      this.trace("interpretacion_de_ast.pasar_minutos_a_cantidad_de_tiempo", arguments);
      const cantidad_de_tiempo = { tipo: "cantidad de tiempo" };
      let minutos_restantes = Math.abs(minutos_originales);
      Calcular_dias: {
        const minutos_en_dias = Math.floor(minutos_restantes / (60 * 24));
        minutos_restantes = Math.floor(minutos_restantes % (60 * 24));
        cantidad_de_tiempo.dias = minutos_en_dias;
      }
      Calcular_horas: {
        const minutos_en_horas = Math.floor(minutos_restantes / (60));
        minutos_restantes = Math.floor(minutos_restantes % (60));
        cantidad_de_tiempo.horas = minutos_en_horas;
      }
      Calcular_minutos: {
        cantidad_de_tiempo.minutos = Math.floor(minutos_restantes);
      }
      Calcular_polaridad: {
        if (minutos_originales < 0) {
          if (cantidad_de_tiempo.dias) {
            cantidad_de_tiempo.dias = cantidad_de_tiempo.dias * (-1);
          }
          if (cantidad_de_tiempo.horas) {
            cantidad_de_tiempo.horas = cantidad_de_tiempo.horas * (-1);
          }
          if (cantidad_de_tiempo.minutos) {
            cantidad_de_tiempo.minutos = cantidad_de_tiempo.minutos * (-1);
          }
        }
      }
      Anular_nulos: {
        if (cantidad_de_tiempo.dias === 0) {
          cantidad_de_tiempo.dias = null;
        }
        if (cantidad_de_tiempo.horas === 0) {
          cantidad_de_tiempo.horas = null;
        }
        if (cantidad_de_tiempo.minutos === 0) {
          cantidad_de_tiempo.minutos = null;
        }
      }
      return cantidad_de_tiempo;
    }

    sumar_cantidades_de_tiempo(...cantidades_de_tiempo) {
      this.trace("interpretacion_de_ast.sumar_cantidades_de_tiempo", arguments);
      let minutos_totales = 0
      for (let index_parametro = 0; index_parametro < cantidades_de_tiempo.length; index_parametro++) {
        const cantidad_de_tiempo = cantidades_de_tiempo[index_parametro];
        minutos_totales += this.pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo);
      }
      return this.pasar_minutos_a_cantidad_de_tiempo(minutos_totales);
    }

    restar_cantidades_de_tiempo(cantidad_de_tiempo_inicial, ...cantidades_de_tiempo) {
      this.trace("interpretacion_de_ast.restar_cantidades_de_tiempo", arguments);
      let minutos_totales = this.pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo_inicial);
      for (let index_parametro = 0; index_parametro < cantidades_de_tiempo.length; index_parametro++) {
        const cantidad_de_tiempo = cantidades_de_tiempo[index_parametro];
        minutos_totales -= this.pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo);
      }
      return this.pasar_minutos_a_cantidad_de_tiempo(minutos_totales);
    }

    multiplicar_cantidad_de_tiempo(cantidad_de_tiempo, veces) {
      this.trace("interpretacion_de_ast.multiplicar_cantidad_de_tiempo", arguments);
      const minutos_totales = this.pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo);
      const minutos_multiplicados = minutos_totales * veces;
      return this.pasar_minutos_a_cantidad_de_tiempo(minutos_multiplicados);
    }

    dividir_cantidades_de_tiempo(cantidad_de_tiempo_1, cantidad_de_tiempo_2) {
      this.trace("interpretacion_de_ast.dividir_cantidades_de_tiempo", arguments);
      const minutos_1 = this.pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo_1);
      const minutos_2 = this.pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo_2);
      return minutos_1 / minutos_2;
    }

    generar_fenomeno_propagativo(extension) {
      this.trace("interpretacion_de_ast.generar_fenomeno_propagativo", arguments);
      const fenomeno = Object.assign({}, extension);
      fenomeno.tipo = "registro de fenómeno en propagación";
      return fenomeno;
    }

    generar_uuid() {
      this.trace("interpretacion_de_ast.generar_uuid", arguments);
      return this.uuid_maximo++;
    }

    agregar_sentencia(sentencia) {
      this.trace("interpretacion_de_ast.agregar_sentencia", arguments);
      sentencia.uuid = this.generar_uuid();
      this.sentencias.push(sentencia);
      return sentencia.uuid;
    }

    agregar_creencia(creencia) {
      this.trace("interpretacion_de_ast.agregar_creencia", arguments);
      creencia.uuid = this.generar_uuid();
      this.creencias.push(creencia);
      return creencia.uuid;
    }

    agregar_accion(accion) {
      this.trace("interpretacion_de_ast.agregar_accion", arguments);
      const fenomeno = this.agregar_fenomeno(accion);
      accion.uuid = this.generar_uuid();
      accion.uuid_de_fenomeno_correspondiente = fenomeno.uuid;
      this.acciones.push(accion);
      return accion.uuid;
    }

    agregar_fenomeno(fenomeno) {
      this.trace("interpretacion_de_ast.agregar_fenomeno", arguments);
      fenomeno.uuid = this.generar_uuid();
      this.fenomenos.push(fenomeno);
      this.agregar_acumulacion_de_tiempo(fenomeno.fenomeno, fenomeno.duracion, fenomeno);
      return fenomeno;
    }

    agregar_fenomeno_propagativo(extension) {
      this.trace("interpretacion_de_ast.agregar_fenomeno_propagativo", arguments);
      const fenomeno = Object.assign({}, this.generar_fenomeno_propagativo(), extension);
      return this.agregar_fenomeno(fenomeno);
    }

    agregar_limite(limite) {
      this.trace("interpretacion_de_ast.agregar_limite", arguments);
      limite.uuid = this.generar_uuid();
      this.limites.push(limite);
      return limite.uuid;
    }

    agregar_acumulacion_de_tiempo(id, cantidad_de_tiempo, fenomeno_causal) {
      this.trace("interpretacion_de_ast.agregar_acumulacion_de_tiempo", arguments);
      const minutos = this.pasar_de_cantidad_de_tiempo_a_minutos(cantidad_de_tiempo);
      if (!(id in this.acumulaciones)) {
        this.acumulaciones[id] = {
          tipo: "acumulación fenoménica",
          minutos: 0,
          bloques: []
        };
      }
      this.acumulaciones[id].minutos += minutos;
      this.acumulaciones[id].bloques.push({
        tipo: "unidad de acumulación fenoménica",
        fenomeno: fenomeno_causal.fenomeno,
        uuid_de_fenomeno: fenomeno_causal.uuid,
        minutos: minutos,
        cantidad_de_tiempo: this.pasar_minutos_a_cantidad_de_tiempo(minutos),
      });
    }

    agregar_notificacion(notificacion) {
      this.trace("interpretacion_de_ast.agregar_notificacion", arguments);
      notificacion.uuid = this.generar_uuid();
      this.notificaciones.push(notificacion);
      return notificacion.uuid;
    }

    buscar_creencia_por_filtro(filtro) {
      this.trace("interpretacion_de_ast.buscar_creencia_por_filtro", arguments);
      return this.creencias.filter(filtro);
    }

    buscar_accion_por_filtro(filtro) {
      this.trace("interpretacion_de_ast.buscar_accion_por_filtro", arguments);
      return this.acciones.filter(filtro);
    }

    buscar_fenomeno_por_filtro(filtro) {
      this.trace("interpretacion_de_ast.buscar_fenomeno_por_filtro", arguments);
      return this.fenomenos.filter(filtro);
    }

    buscar_limite_por_filtro(filtro) {
      this.trace("interpretacion_de_ast.buscar_limite_por_filtro", arguments);
      return this.limites.filter(filtro);
    }

    buscar_acumulacion_por_filtro(filtro) {
      this.trace("interpretacion_de_ast.buscar_acumulacion_por_filtro", arguments);
      return Object.values(this.acumulaciones).filter(filtro);
    }

    procesar_sentencia(sentencia) {
      this.trace("interpretacion_de_ast.procesar_sentencia", arguments);
      this.agregar_sentencia(sentencia);
      switch (sentencia.tipo) {
        case "sentencia de definir fenómeno":
          this.procesar_sentencia_de_definir_fenomeno(sentencia);
          break;
        case "sentencia de registrar fenómenos":
          this.procesar_sentencia_de_registrar_fenomenos(sentencia);
          break;
        case "sentencia de limitar fenómenos":
          this.procesar_sentencia_de_limitar_fenomenos(sentencia);
          break;
        case "sentencia de cambiar estado":
          this.procesar_sentencia_de_cambiar_estado(sentencia);
          break;
        default:
          this.log("Sentencia:");
          this.log(sentencia);
          throw new Error("Sentencia no identificada");
      }
    }

    pasar_a_objeto_plano() {
      this.trace("interpretacion_de_ast.pasar_a_objeto_plano", arguments);
      return {
        sentencias: this.sentencias,
        creencias: this.creencias,
        acciones: this.acciones,
        fenomenos: this.fenomenos,
        limites: this.limites,
        acumulaciones: this.acumulaciones,
        notificaciones: this.notificaciones,
        estados: this.estados,
      };
    }

    orden_tipico_de_propiedades = [
      "fenomeno",
      "uuid",
      "uuid_de_fenomeno_correspondiente",
      "uuid_de_accion_original",
      "uuid_de_fenomeno_anterior",
      "estado",
      "duracion",
      "dia",
      "hora",
      "matices",
      "hilo"
    ];

    reordenar_propiedades_de_objeto(objeto, orden = this.orden_tipico_de_propiedades) {
      this.trace("interpretacion_de_ast.reordenar_propiedades_de_objeto", arguments);
      const salida = {};
      for (let index = 0; index < orden.length; index++) {
        const propiedad = orden[index];
        if (propiedad in objeto) {
          salida[propiedad] = objeto[propiedad];
        }
      }
      Iterando_propiedades:
      for (let propiedad in objeto) {
        if (propiedad in salida) {
          continue Iterando_propiedades;
        }
        salida[propiedad] = objeto[propiedad];
      }
      return salida;
    }

    ejecutar_propagacion_de_fenomeno_segun_es_producido_por(hilo_causal, fenomeno_causal, creencia, indice_de_causa, causa, extension_de_fenomeno = {}) {
      this.trace("interpretacion_de_ast.ejecutar_propagacion_de_fenomeno_segun_es_producido_por", arguments);
      const fenomeno_propagado = this.reordenar_propiedades_de_objeto(Object.assign({}, extension_de_fenomeno, {
        estado: fenomeno_causal.estado,
        fenomeno: creencia.fenomeno,
        dia: fenomeno_causal.dia,
        hora: fenomeno_causal.hora,
        hilo: [].concat(hilo_causal).concat([{
          tipo: "punto causal según «es producido por»",
          sujeto: creencia.fenomeno,
          verbo: "es_producido_por",
          objeto: causa.fenomeno,
          creencia: creencia.uuid,
          indice_de_causa,
          explicacion: "según creencia «" + creencia.uuid + "» ocurre que «" + creencia.fenomeno + "» es producido por «" + causa.fenomeno + "»"
        }]),
        matices: null,
        uuid_de_fenomeno_correspondiente: null,
        uuid_de_accion_original: fenomeno_causal.uuid_de_accion_original,
        uuid_de_fenomeno_anterior: fenomeno_causal.uuid
      }));
      const nuevo_fenomeno = this.agregar_fenomeno_propagativo(fenomeno_propagado);
      this.propagar_fenomeno(nuevo_fenomeno.hilo, nuevo_fenomeno);
    }

    ejecutar_propagacion_de_fenomeno_segun_produce(hilo_causal, fenomeno_causal, creencia, indice_de_consecuencia, consecuencia, extension_de_fenomeno = {}) {
      this.trace("interpretacion_de_ast.ejecutar_propagacion_de_fenomeno_segun_produce", arguments);
      const fenomeno_propagado = this.reordenar_propiedades_de_objeto(Object.assign({}, extension_de_fenomeno, {
        estado: fenomeno_causal.estado,
        fenomeno: consecuencia.fenomeno,
        dia: fenomeno_causal.dia,
        hora: fenomeno_causal.hora,
        hilo: [].concat(hilo_causal).concat([{
          tipo: "punto causal según «produce»",
          sujeto: creencia.fenomeno,
          verbo: "produce",
          objeto: consecuencia.fenomeno,
          creencia: creencia.uuid,
          indice_de_consecuencia,
          explicacion: "según creencia «" + creencia.uuid + "» ocurre que «" + creencia.fenomeno + "» produce «" + consecuencia.fenomeno + "»"
        }]),
        matices: null,
        uuid_de_fenomeno_correspondiente: null,
        uuid_de_accion_original: fenomeno_causal.uuid_de_accion_original,
        uuid_de_fenomeno_anterior: fenomeno_causal.uuid
      }));
      const nuevo_fenomeno = this.agregar_fenomeno_propagativo(fenomeno_propagado);
      this.propagar_fenomeno(nuevo_fenomeno.hilo, nuevo_fenomeno);
    }

    ejecutar_propagacion_de_fenomeno_segun_matiz(hilo_causal, fenomeno_causal, matiz, indice_de_matiz) {
      this.trace("interpretacion_de_ast.ejecutar_propagacion_de_fenomeno_segun_matiz", arguments);
      const fenomeno_propagado = this.reordenar_propiedades_de_objeto(Object.assign({}, fenomeno_causal, {
        tipo: "registro de fenómeno por matiz",
        estado: fenomeno_causal.estado,
        fenomeno: matiz.fenomeno,
        duracion: matiz.modificacion.cantidad,
        dia: fenomeno_causal.dia,
        hora: fenomeno_causal.hora,
        hilo: [].concat(hilo_causal).concat([{
          tipo: "punto causal según matiz",
          sujeto: fenomeno_causal.fenomeno,
          verbo: "produce por matiz",
          objeto: matiz.fenomeno,
          creencia: null,
          indice_de_matiz,
          explicacion: "según registro «" + fenomeno_causal.uuid + "» ocurre que «" + fenomeno_causal.fenomeno + "» produce por matiz «" + matiz.fenomeno + "»"
        }]),
        matices: null,
        uuid_de_fenomeno_correspondiente: null,
        uuid_de_accion_original: fenomeno_causal.uuid_de_accion_original,
        uuid_de_fenomeno_anterior: fenomeno_causal.uuid
      }));
      const nuevo_fenomeno = this.agregar_fenomeno_propagativo(fenomeno_propagado);
      this.propagar_fenomeno(nuevo_fenomeno.hilo, nuevo_fenomeno);
    }

    corregir_cantidad_de_tiempo_segun_polaridad(cantidad, polaridad) {
      this.trace("interpretacion_de_ast.corregir_cantidad_de_tiempo_segun_polaridad", arguments);
      const cantidad_2 = Object.assign({}, cantidad);
      if (polaridad === "-") {
        if (cantidad_2.dias) {
          cantidad_2.dias = cantidad_2.dias * (-1)
        }
        if (cantidad_2.horas) {
          cantidad_2.horas = cantidad_2.horas * (-1)
        }
        if (cantidad_2.minutos) {
          cantidad_2.minutos = cantidad_2.minutos * (-1)
        }
      }
      return cantidad_2;
    }

    propagar_fenomeno(hilo_causal, fenomeno_causal) {
      this.trace("interpretacion_de_ast.propagar_fenomeno", arguments);
      Romperrecursividad: {
        const explicaciones = [];
        for (let index = 0; index < hilo_causal.length; index++) {
          const punto_causal = hilo_causal[index];
          if (punto_causal.explicacion) {
            if (explicaciones.indexOf(punto_causal.explicacion) === -1) {
              explicaciones.push(punto_causal.explicacion);
            } else {
              throw new Error("Prevenido bucle infinito relacionado con la creencia: " + punto_causal.explicacion);
            }
          }
        }
      }
      const nombre_de_fenomeno = fenomeno_causal.fenomeno;
      const duracion_de_fenomeno = fenomeno_causal.duracion;
      Propagando_a_estado_si_escaece: {
        if(!this.estados.historicos.length) {
          break Propagando_a_estado_si_escaece;
        }
        const ultimo_estado = this.estados.historicos[this.estados.historicos.length-1];
        if(nombre_de_fenomeno in ultimo_estado) {
          ultimo_estado[nombre_de_fenomeno] = this.sumar_cantidades_de_tiempo(ultimo_estado[nombre_de_fenomeno], duracion_de_fenomeno);
        }
      }
      Propagando_consecuencias_segun_es_producido_por:
      for (let index_creencias = 0; index_creencias < this.creencias.length; index_creencias++) {
        const creencia = this.creencias[index_creencias];
        const causas = (creencia.es_producido_por ? creencia.es_producido_por : []).concat(creencia.es_consumido_por ? creencia.es_consumido_por : []);
        if (causas.length === 0) {
          continue Propagando_consecuencias_segun_es_producido_por;
        }
        Iterando_causas_de_creencia:
        for (let index_causas = 0; index_causas < causas.length; index_causas++) {
          const causa = causas[index_causas];
          const esta_refiriendose_al_mismo_fenomeno = causa.fenomeno === nombre_de_fenomeno;
          if (!esta_refiriendose_al_mismo_fenomeno) {
            continue Iterando_causas_de_creencia;
          }
          if (causa.desde) {
            const diferencia_duracion_y_desde = this.restar_cantidades_de_tiempo(duracion_de_fenomeno, causa.desde);
            const diferencia_duracion_y_desde_en_minutos = this.pasar_de_cantidad_de_tiempo_a_minutos(diferencia_duracion_y_desde);
            if (diferencia_duracion_y_desde_en_minutos < 0) {
              continue Iterando_causas_de_creencia;
            }
          }
          if (causa.hasta) {
            const diferencia_duracion_y_hasta = this.restar_cantidades_de_tiempo(duracion_de_fenomeno, causa.hasta);
            const diferencia_duracion_y_hasta_en_minutos = this.pasar_de_cantidad_de_tiempo_a_minutos(diferencia_duracion_y_hasta);
            if (diferencia_duracion_y_hasta_en_minutos > 0) {
              continue Iterando_causas_de_creencia;
            }
          }
          if (causa.cada) {
            const ratio = this.dividir_cantidades_de_tiempo(duracion_de_fenomeno, causa.cada);
            const cantidad_de_tiempo_de_fenomeno_propagado = this.multiplicar_cantidad_de_tiempo(causa.variacion.cantidad, ratio);
            this.ejecutar_propagacion_de_fenomeno_segun_es_producido_por(hilo_causal, fenomeno_causal, creencia, index_causas, causa, {
              duracion: cantidad_de_tiempo_de_fenomeno_propagado
            });
          } else {
            this.ejecutar_propagacion_de_fenomeno_segun_es_producido_por(hilo_causal, fenomeno_causal, creencia, index_causas, causa, {
              duracion: causa.variacion.cantidad
            });
          }
        }
      }
      Propagando_consecuencias_segun_produce:
      for (let index_creencias = 0; index_creencias < this.creencias.length; index_creencias++) {
        const creencia = this.creencias[index_creencias];
        const esta_definiendo_mismo_fenomeno = creencia.fenomeno === nombre_de_fenomeno;
        if (!esta_definiendo_mismo_fenomeno) {
          continue Propagando_consecuencias_segun_produce;
        }
        const consecuencias = (creencia.produce ? creencia.produce : []).concat(creencia.consume ? creencia.consume : []);
        if (consecuencias.length === 0) {
          continue Propagando_consecuencias_segun_produce;
        }
        Iterando_consecuencias_de_creencia:
        for (let index_consecuencias = 0; index_consecuencias < consecuencias.length; index_consecuencias++) {
          const consecuencia = consecuencias[index_consecuencias];
          if (consecuencia.desde) {
            const diferencia_duracion_y_desde = this.restar_cantidades_de_tiempo(duracion_de_fenomeno, consecuencia.desde);
            const diferencia_duracion_y_desde_en_minutos = this.pasar_de_cantidad_de_tiempo_a_minutos(diferencia_duracion_y_desde);
            if (diferencia_duracion_y_desde_en_minutos < 0) {
              continue Iterando_consecuencias_de_creencia;
            }
          }
          if (consecuencia.hasta) {
            const diferencia_duracion_y_hasta = this.restar_cantidades_de_tiempo(duracion_de_fenomeno, consecuencia.hasta);
            const diferencia_duracion_y_hasta_en_minutos = this.pasar_de_cantidad_de_tiempo_a_minutos(diferencia_duracion_y_hasta);
            if (diferencia_duracion_y_hasta_en_minutos > 0) {
              continue Iterando_consecuencias_de_creencia;
            }
          }
          if (consecuencia.cada) {
            const ratio = this.dividir_cantidades_de_tiempo(duracion_de_fenomeno, consecuencia.cada);
            const cantidad_de_tiempo_de_fenomeno_propagado = this.multiplicar_cantidad_de_tiempo(consecuencia.variacion.cantidad, ratio);
            this.ejecutar_propagacion_de_fenomeno_segun_produce(hilo_causal, fenomeno_causal, creencia, index_consecuencias, consecuencia, {
              duracion: cantidad_de_tiempo_de_fenomeno_propagado
            });
          } else {
            this.ejecutar_propagacion_de_fenomeno_segun_produce(hilo_causal, fenomeno_causal, creencia, index_consecuencias, consecuencia, {
              duracion: consecuencia.variacion.cantidad
            });
          }
        }
      }
      if (fenomeno_causal.matices) {
        for (let index_matiz = 0; index_matiz < fenomeno_causal.matices.length; index_matiz++) {
          const matiz = fenomeno_causal.matices[index_matiz];
          this.ejecutar_propagacion_de_fenomeno_segun_matiz([fenomeno_causal], fenomeno_causal, matiz, index_matiz);
        }
      }
      return fenomeno_causal;
    }

    procesar_sentencia_de_definir_fenomeno(sentencia) {
      this.trace("interpretacion_de_ast.procesar_sentencia_de_definir_fenomeno", arguments);
      this.agregar_creencia(sentencia);
    }

    procesar_sentencia_de_registrar_fenomenos(sentencia) {
      this.trace("interpretacion_de_ast.procesar_sentencia_de_registrar_fenomenos", arguments);
      if (["!", "-"].indexOf(sentencia.estado) !== -1) {
        return;
      }
      Iterando_registro_de_fenomenos:
      for (let index_registro = 0; index_registro < sentencia.registros.length; index_registro++) {
        const registro = sentencia.registros[index_registro];
        if (["!", "-"].indexOf(registro.estado) !== -1) {
          continue Iterando_registro_de_fenomenos;
        }
        registro.dia = sentencia.dia;
        const id_accion = this.agregar_accion(registro);
        registro.uuid_de_accion_original = id_accion;
        registro.uuid_de_fenomeno_anterior = null;
        this.propagar_fenomeno([registro], registro);
      }
    }

    procesar_sentencia_de_limitar_fenomenos(sentencia) {
      this.trace("interpretacion_de_ast.procesar_sentencia_de_limitar_fenomenos", arguments);
      this.agregar_limite(sentencia);
    }

    procesar_sentencia_de_cambiar_estado(sentencia) {
      this.trace("interpretacion_de_ast.procesar_sentencia_de_cambiar_estado", arguments);
      const { estado, operacion } = sentencia;
      if(operacion === "reiniciar") {
        this.estados.historicos.push(estado);
      } else if(operacion === "ampliar") {
        const indice = this.estados.historicos.length ? this.estados.historicos.length-1 : 0;
        this.estados.historicos[indice] = estado;
      } else {
        throw new Error("Operación no reconocida");
      }
    }

    cargar_interpretacion() {
      this.trace("interpretacion_de_ast.cargar_interpretacion", arguments);
      const cmt_ast = [].concat(this.ast_original);
      this.uuid_maximo = 0;
      this.sentencias = [];
      this.creencias = [];
      this.acciones = [];
      this.fenomenos = [];
      this.limites = [];
      this.acumulaciones = {};
      this.notificaciones = [];
      this.estados = {
        historicos: [{}]
      };
      for (let index_sentencia_global = 0; index_sentencia_global < cmt_ast.length; index_sentencia_global++) {
        const sentencia_global = cmt_ast[index_sentencia_global];
        this.procesar_sentencia(sentencia_global);
      }
      this.expandir_datos();
    }

    expandir_datos() {
      this.trace("interpretacion_de_ast.expandir_datos", arguments);
      Expandiendo_minutos_de_acumulaciones: {
        for (let acumulacion_id in this.acumulaciones) {
          const minutos_de_acumulacion = this.acumulaciones[acumulacion_id].minutos;
          const cantidad_de_tiempo_de_acumulacion = this.pasar_minutos_a_cantidad_de_tiempo(minutos_de_acumulacion);
          this.acumulaciones[acumulacion_id].cantidad = cantidad_de_tiempo_de_acumulacion;
        }
      }
      Expandiendo_ultimo_estado_y_total: {
        if(!this.estados.historicos.length) {
          this.estados.ultimo = {};
          break Expandiendo_ultimo_estado_y_total;
        }
        this.estados.ultimo = Object.assign({}, this.estados.historicos[this.estados.historicos.length-1]);
        const fenomenos = Object.keys(this.estados.ultimo);
        for(let index=0; index<fenomenos.length; index++) {
          const fenomeno = fenomenos[index];
          const estado_de_fenomeno = this.estados.ultimo[fenomeno];
          const total_en_minutos = this.pasar_de_cantidad_de_tiempo_a_minutos(estado_de_fenomeno);
          this.estados.ultimo[fenomeno] = Object.assign({}, this.estados.ultimo[fenomeno], {en_minutos: total_en_minutos});
        }
      }
      Expandiendo_notificaciones_de_limites_actuales: {
        const ahora = new Date();
        Iterando_dias:
        for (let index_dias = 0; index_dias < this.limites.length; index_dias++) {
          const limite = this.limites[index_dias];
          const esta_en_el_dia = this.comprobar_si_date_esta_entre_dias_del_calendario(ahora, limite.intervalo_de_dias.inicio, limite.intervalo_de_dias.final);
          if (!esta_en_el_dia) {
            continue Iterando_dias;
          }
          Iterando_horas:
          for (let index_horas = 0; index_horas < limite.horas.length; index_horas++) {
            const limite_segun_horas = limite.horas[index_horas];
            const esta_en_la_hora = this.comprobar_si_date_esta_entre_horas(ahora, limite_segun_horas.intervalo_de_horas.inicio, limite_segun_horas.intervalo_de_horas.final);
            if (!esta_en_la_hora) {
              continue Iterando_horas;
            }
            Iterando_limites_establecidos:
            for (let index_limites = 0; index_limites < limite_segun_horas.limites.length; index_limites++) {
              const limite_establecido = limite_segun_horas.limites[index_limites];
              const nombre_de_fenomeno_limitado = limite_establecido.fenomeno;
              // @TODO: comprobar qué mensaje (- / = / +) le corresponde según el estado de cada fenómeno.
              // @TODO: hay que calcular la acumulación de los fenómenos limitados pero solo producida en la franja de tiempo que comenta.
              let acumulacion_de_minutos_de_fenomeno_en_intervalo = 0;
              let limite_actual = undefined;
              if (limite_establecido.cada) {
                limite_actual = this.calcular_intervalo_de_tiempo_valido_actual_de_fenomeno_segun_parametro_cada(limite_establecido.cada, limite_segun_horas.intervalo_de_horas.inicio, ahora);
              } else {
                limite_actual = limite_segun_horas.intervalo_de_horas;
              }
              Iterando_fenomenos:
              for (let index_fenomeno = 0; index_fenomeno < this.fenomenos.length; index_fenomeno++) {
                const fenomeno = this.fenomenos[index_fenomeno];
                const nombre_de_fenomeno = fenomeno.fenomeno;
                if (nombre_de_fenomeno !== nombre_de_fenomeno_limitado) {
                  continue Iterando_fenomenos;
                }
                const fecha_de_fenomeno = this.pasar_dia_y_hora_a_date(fenomeno.dia, fenomeno.hora);
                const esta_fenomeno_en_intervalo_de_dias = this.comprobar_si_date_esta_entre_dias_del_calendario(fecha_de_fenomeno, limite.intervalo_de_dias.inicio, limite.intervalo_de_dias.final);
                if (!esta_fenomeno_en_intervalo_de_dias) {
                  continue Iterando_fenomenos;
                }
                const esta_fenomeno_en_intervalo_de_horas = this.comprobar_si_date_esta_entre_horas(fecha_de_fenomeno, limite_actual.inicio, limite_actual.final);
                if (!esta_fenomeno_en_intervalo_de_horas) {
                  continue Iterando_fenomenos;
                }
                const minutos_de_duracion_de_fenomeno = this.pasar_de_cantidad_de_tiempo_a_minutos(fenomeno.duracion);
                acumulacion_de_minutos_de_fenomeno_en_intervalo += minutos_de_duracion_de_fenomeno;
              }
              // this.log(limite_establecido);
              const minutos_minimos = this.pasar_de_cantidad_de_tiempo_a_minutos(limite_establecido.minimo);
              const minutos_maximos = this.pasar_de_cantidad_de_tiempo_a_minutos(limite_establecido.maximo);
              const excede_el_minimo = minutos_minimos > acumulacion_de_minutos_de_fenomeno_en_intervalo;
              const excede_el_maximo = minutos_maximos < acumulacion_de_minutos_de_fenomeno_en_intervalo;
              if (excede_el_minimo) {
                this.agregar_notificacion({
                  tipo: "notificación",
                  uuid_de_limite: limite.uuid,
                  fenomeno: limite_establecido.fenomeno,
                  estado: "excede el mínimo",
                  intervalo_de_tiempo: limite_actual,
                  minimo: limite_establecido.minimo,
                  maximo: limite_establecido.maximo,
                  cada: limite_establecido.cada,
                  intervalo_de_valores_validos: limite_actual,
                  mensaje: limite_establecido.mensajes && limite_establecido.mensajes.minimo ? limite_establecido.mensajes.minimo : "{" + limite_establecido.fenomeno + "} excede el mínimo conforme al límite «" + limite.uuid + "»",
                });
              } else if (excede_el_maximo) {
                this.agregar_notificacion({
                  tipo: "notificación",
                  uuid_de_limite: limite.uuid,
                  fenomeno: limite_establecido.fenomeno,
                  estado: "excede el máximo",
                  intervalo_de_tiempo: limite_actual,
                  minimo: limite_establecido.minimo,
                  maximo: limite_establecido.maximo,
                  cada: limite_establecido.cada,
                  intervalo_de_valores_validos: limite_actual,
                  mensaje: limite_establecido.mensajes && limite_establecido.mensajes.maximo ? limite_establecido.mensajes.maximo : "{" + limite_establecido.fenomeno + "} excede el máximo conforme al límite «" + limite.uuid + "»",
                });
              } else {
                this.agregar_notificacion({
                  tipo: "notificación",
                  uuid_de_limite: limite.uuid,
                  fenomeno: limite_establecido.fenomeno,
                  estado: "es correcto",
                  intervalo_de_tiempo: limite_actual,
                  minimo: limite_establecido.minimo,
                  maximo: limite_establecido.maximo,
                  cada: limite_establecido.cada,
                  intervalo_de_valores_validos: limite_actual,
                  mensaje: limite_establecido.mensajes && limite_establecido.mensajes.valido ? limite_establecido.mensajes.valido : "{" + limite_establecido.fenomeno + "} es correcto conforme al límite «" + limite.uuid + "»",
                });
              }
              // Fin de: Iterando_fenomenos 
            }
            // Fin de: Iterando_limites_establecidos 
          }
          // Fin de: Iterando_horas 
        }
        // Fin de: Iterando_dias 
      }
      // Fin de: Expandiendo_notificaciones_de_limites_actuales 
    }

    generar_fecha_segun_incremento_de_minutos(fecha, incremento) {
      this.trace("interpretacion_de_ast.generar_fecha_segun_incremento_de_minutos", arguments);
      const fecha_nueva = new Date(fecha);
      fecha_nueva.setMinutes(fecha_nueva.getMinutes() + incremento);
      return fecha_nueva;
    }

    calcular_intervalo_de_tiempo_valido_actual_de_fenomeno_segun_parametro_cada(cada, hora_de_inicio, date_actual) {
      this.trace("interpretacion_de_ast.calcular_intervalo_de_tiempo_valido_actual_de_fenomeno_segun_parametro_cada", arguments);
      const date_inicial = this.pasar_de_hora_a_date(hora_de_inicio, date_actual);
      const minutos_por_parte = this.pasar_de_cantidad_de_tiempo_a_minutos(cada);
      let date_pivote = new Date(date_inicial);
      while (date_pivote <= date_actual) {
        const date_inicio = this.generar_fecha_segun_incremento_de_minutos(date_pivote, 0);
        const date_final = this.generar_fecha_segun_incremento_de_minutos(date_pivote, minutos_por_parte);
        date_pivote = date_final;
        if (date_actual >= date_inicio) {
          if (date_actual <= date_final) {
            return {
              inicio: this.pasar_date_a_hora_solamente(date_inicio),
              final: this.pasar_date_a_hora_solamente(date_final)
            };
          }
        }
      }
    }

    pasar_date_a_hora_solamente(fecha) {
      this.trace("interpretacion_de_ast.pasar_date_a_hora_solamente", arguments);
      return {
        tipo: "hora del día",
        hora: fecha.getHours(),
        minuto: fecha.getMinutes()
      };
    }

    pasar_de_dia_a_date(dia) {
      this.trace("interpretacion_de_ast.pasar_de_dia_a_date", arguments);
      const fecha = new Date();
      fecha.setFullYear(dia.anyo);
      fecha.setMonth(dia.mes - 1);
      fecha.setDate(dia.dia);
      fecha.setHours(0);
      fecha.setMinutes(0);
      fecha.setSeconds(0);
      fecha.setMilliseconds(0);
      return fecha;
    }

    pasar_de_hora_a_date(hora, fecha_base) {
      this.trace("interpretacion_de_ast.pasar_de_hora_a_date", arguments);
      const fecha = fecha_base ? new Date(fecha_base) : new Date();
      fecha.setHours(hora.hora ?? 0);
      fecha.setMinutes(hora.minuto ?? 0);
      fecha.setSeconds(0);
      fecha.setMilliseconds(0);
      return fecha;
    }

    pasar_dia_y_hora_a_date(dia, hora) {
      this.trace("interpretacion_de_ast.pasar_dia_y_hora_a_date", arguments);
      const fecha_base = this.pasar_de_dia_a_date(dia);
      return this.pasar_de_hora_a_date(hora, fecha_base);
    }

    modificar_date_para_ultimo_milisegundo_del_dia(fecha_base) {
      this.trace("interpretacion_de_ast.modificar_date_para_ultimo_milisegundo_del_dia", arguments);
      const fecha = new Date(fecha_base);
      fecha.setHours(23);
      fecha.setMinutes(59);
      fecha.setSeconds(59);
      fecha.setMilliseconds(999);
      return fecha;
    }

    comprobar_si_date_esta_entre_dias_del_calendario(fecha, dia_inicio, dia_final) {
      this.trace("interpretacion_de_ast.comprobar_si_date_esta_entre_dias_del_calendario", arguments);
      const fecha_dia_inicio = this.pasar_de_dia_a_date(dia_inicio);
      const fecha_dia_final = this.modificar_date_para_ultimo_milisegundo_del_dia(this.pasar_de_dia_a_date(dia_final));
      return fecha >= fecha_dia_inicio && fecha <= fecha_dia_final;
    }

    comprobar_si_date_esta_entre_horas(fecha, hora_inicio, hora_final) {
      this.trace("interpretacion_de_ast.comprobar_si_date_esta_entre_horas", arguments);
      const fecha_hora_inicio = this.pasar_de_hora_a_date(hora_inicio, fecha);
      const fecha_hora_final = this.pasar_de_hora_a_date(hora_final, fecha);
      return fecha >= fecha_hora_inicio && fecha <= fecha_hora_final;
    }

    llenar_por_la_izquierda(texto, longitud = 2, relleno = "0") {
      this.trace("interpretacion_de_ast.llenar_por_la_izquierda", arguments);
      let llenado = "" + texto;
      while (llenado.length < longitud) {
        llenado = relleno + llenado;
      }
      return llenado;
    }

    pasar_date_a_legible(fecha) {
      this.trace("interpretacion_de_ast.pasar_date_a_legible", arguments);
      let legible = "";
      legible += fecha.getFullYear();
      legible += "/";
      legible += this.llenar_por_la_izquierda(fecha.getMonth() + 1);
      legible += "/";
      legible += this.llenar_por_la_izquierda(fecha.getDate());
      legible += " ";
      legible += this.llenar_por_la_izquierda(fecha.getHours());
      legible += ":";
      legible += this.llenar_por_la_izquierda(fecha.getMinutes());
      legible += ":";
      legible += this.llenar_por_la_izquierda(fecha.getSeconds());
      legible += ".";
      legible += this.llenar_por_la_izquierda(fecha.getMilliseconds(), 3);
      return legible;
    }

  };

  const interpretar_ast = function (...args) {
    return new Interpretacion_de_ast(...args);
  };

  return { interpretar_ast };

});