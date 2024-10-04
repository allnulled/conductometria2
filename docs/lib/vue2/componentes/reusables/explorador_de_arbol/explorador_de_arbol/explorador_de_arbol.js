return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/explorador_de_arbol/explorador_de_arbol.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "explorador-de-arbol",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/explorador_de_arbol/explorador_de_arbol.xml",
    props: {
      identificadorDeReportes: {
        type: String,
        required: true,
      },
      identificadorDeRuta: {
        type: Array,
        required: true
      },
      exploradorRaiz: {
        type: [Object, String],
        required: true
      },
      exploradorPadre: {
        type: [Object, String],
        required: true
      },
      datosBase: {
        type: [Object, Array],
        required: true
      }
    },
    data() {
      this.$utilidades.tracear("explorador_de_arbol.data");
      return {
        // 1. Estado del widget:
        seccion_seleccionada: undefined,
        esta_cargando_seccion: true,
        esta_cargando_datos_de_reportes: false,
        documentos_abiertos: [],
        // 2. Nodos concomitantes:
        explorador_raiz: (typeof(this.exploradorRaiz) === "string") ? this : this.exploradorRaiz,
        explorador_padre: (typeof(this.exploradorPadre) === "string") ? this : this.exploradorPadre,
        // 3. Parámetros estrictos:
        es_explorador_raiz: typeof(this.exploradorRaiz) === "string",
        identificador_de_ruta: this.identificadorDeRuta,
        identificador_de_reportes: this.identificadorDeReportes,
        // 4. Datos observados:
        datos_base: this.datosBase,
        datos_de_reportes: undefined,
        datos_base_modificados: undefined,
        documento_a_eliminar: undefined,
        indice_de_documento_a_eliminar: undefined,
        explorador_de_documento_a_eliminar: undefined,
        texto_a_importar: "",
        componente_de_seccion_de_configuracion: undefined,
        error_de_importacion: undefined,
      }
    },
    methods: {
      get_por_id(datos, id) {
        this.$utilidades.tracear("explorador_de_arbol.get_por_id");
        let salida = datos;
        for(let index=0; index<id.length; index++) {
          const id_item = id[index];
          salida = salida[id_item];
        }
        return salida;
      },
      set_por_id(datos, id, valor) {
        this.$utilidades.tracear("explorador_de_arbol.set_por_id");
        let salida = datos;
        for(let index=0; index<id.length; index++) {
          const id_item = id[index];
          if(index === (id.length - 1)) {
            salida[id_item] = valor;
          } else {
            salida = salida[id_item];
          }
        }
        return datos;
      },
      delete_por_id(datos, id) {
        this.$utilidades.tracear("explorador_de_arbol.set_por_id");
        let salida = datos;
        for(let index=0; index<id.length; index++) {
          const id_item = id[index];
          if(index === (id.length - 1)) {
            if(Array.isArray(salida)) {
              salida.splice(id_item, 1);
            } else if(typeof salida === "object") {
              delete salida[id_item];
            }
          } else {
            salida = salida[id_item];
          }
        }
        return datos;
      },
      move_up_por_id(datos, id) {
        this.$utilidades.tracear("explorador_de_arbol.set_por_id");
        if(id[id.length-1] <= 0) {
          return;
        }
        let salida = datos;
        for(let index=0; index<id.length; index++) {
          const id_item = id[index];
          if(index === (id.length - 1)) {
            const temp = salida[id_item - 1];
            salida[id_item - 1] = salida[id_item];
            salida[id_item] = temp;
          } else {
            salida = salida[id_item];
          }
        }
        return datos;
      },
      move_down_por_id(datos, id) {
        this.$utilidades.tracear("explorador_de_arbol.set_por_id");
        let salida = datos;
        for(let index=0; index<id.length; index++) {
          const id_item = id[index];
          if(index === (id.length - 1)) {
            const ultimo_index = id[id.length-1];
            if(ultimo_index >= (salida.length-1)) {
              return;
            }
            const temp = salida[id_item + 1];
            salida[id_item + 1] = salida[id_item];
            salida[id_item] = temp;
          } else {
            salida = salida[id_item];
          }
        }
        return datos;
      },
      generar_uuid(longitud = 50, solo_alfabeto_simple = false) {
        this.$utilidades.tracear("explorador_de_arbol.generar_uuid");
        const alfabeto = solo_alfabeto_simple ? "abcdefghijklmnopqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let salida = "";
        while(salida.length < longitud) {
          salida += alfabeto[Math.floor(Math.random()*alfabeto.length)];
        }
        return salida;
      },
      generar_palabra(silabas_minimas, silabas_maximas) {
        this.$utilidades.tracear("explorador_de_arbol.generar_palabra");
        const vocales = "aeiou";
        const consonantes = "bcdfgjklmnpqrstvxz";
        let salida = "";
        let silabas = 0;
        const silabas_definitivas = Math. floor(Math. random()*silabas_maximas) + silabas_minimas;
        while(silabas < silabas_definitivas) {
          silabas++;
          salida += consonantes[Math.floor(Math.random()*consonantes.length)];
          salida += vocales[Math.floor(Math.random()*vocales.length)];
        }
        return salida;
      },
      alternar_expansion_de_documento(uuid) {
        this.$utilidades.tracear("explorador_de_arbol.alternar_expansion_de_documento");
        const posicion = this.documentos_abiertos.indexOf(uuid);
        if(posicion === -1) {
          this.documentos_abiertos.push(uuid);
        } else {
          this.documentos_abiertos.splice(posicion, 1);
        }
      },
      ir_a_seccion(seccion) {
        this.$utilidades.tracear("explorador_de_arbol.ir_a_seccion");
        this.esta_cargando_seccion = true;
        this.seccion_seleccionada = seccion;
        setTimeout(() => {
          this.cargar_seccion(seccion).then(() => {
            this.esta_cargando_seccion = false;
          });
        }, 10);
      },
      cargar_memoria_de_reportes_absolutos(forzar = false) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_memoria_de_reportes_absolutos");
        if(this.explorador_raiz.datos_de_reportes_absolutos && !forzar) {
          return this.explorador_raiz.datos_de_reportes_absolutos;
        }
        return new Promise(resolve => {
          if(!(this.identificador_de_reportes in localStorage)) {
            localStorage[this.identificador_de_reportes] = JSON.stringify({
              uuid: this.generar_uuid(),
              nombre: "Reporte inicial",
              modificador: "",
              plantilla: "<widget-de-inicio :datos='datos' :padre='this' />",
              componente: "",
              documentos: [],
            });
          }
          const reportes = JSON.parse(localStorage[this.identificador_de_reportes]);
          this.explorador_raiz.datos_de_reportes_absolutos = reportes;
          resolve();
        });
      },
      cargar_memoria_de_reportes_relativos(forzar = false) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_memoria_de_reportes_relativos");
        return new Promise(resolve => {
          const reportes_por_id = this.get_por_id(this.explorador_raiz.datos_de_reportes_absolutos, this.identificador_de_ruta);
          const reportes = reportes_por_id;
          this.datos_de_reportes_relativos = reportes;
          resolve();
        });
      },
      cargar_memoria_de_parametros() {
        this.$utilidades.tracear("explorador_de_arbol.cargar_memoria_de_parametros");
        this.datos_base = this.datosBase;
      },
      cargar_datos_base_modificados() {
        return new Promise((resolve, reject) => {
          const nombre = this.datos_de_reportes_relativos.nombre;
          const fuente_de_modificador = this.datos_de_reportes_relativos.modificador;
          let fuente_de_funcion_de_modificador = "";
          fuente_de_funcion_de_modificador = "(async function(datos) {\n";
          fuente_de_funcion_de_modificador += "  return datos;\n";
          fuente_de_funcion_de_modificador += "}).call(this, this.datos_base)";
          if(fuente_de_modificador.trim() !== "") {
            // @TODO... 
            fuente_de_funcion_de_modificador = "(async function(datos) {\n";
            fuente_de_funcion_de_modificador += "  try {\n";
            fuente_de_funcion_de_modificador += "    " + fuente_de_modificador + "\n";
            fuente_de_funcion_de_modificador += "  } catch(error) {\n";
            fuente_de_funcion_de_modificador += "    error.message = '[cargar_datos_base_modificados] [' + nombre + '] ' + error.message;\n";
            fuente_de_funcion_de_modificador += "  }\n";
            fuente_de_funcion_de_modificador += "}).call(this, this.datos_base)";
          }
          try {
            const promesa_de_modificador = eval(fuente_de_funcion_de_modificador);
            promesa_de_modificador.then(modificacion => {
              this.datos_base_modificados = modificacion;
              return resolve(modificacion);
            });
          } catch (error) {
            error.message = "[cargar_datos_base_modificados] [" + nombre + "] " + error.message;
            return reject(error);
          }
        });
      },
      cargar_seccion(seccion) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion");
        this.esta_cargando_seccion = true;
        return new Promise(resolve => {
          this["cargar_seccion_de_" + seccion]().then(() => {
            resolve();
            this.esta_cargando_seccion = false;
          });
        });
      },
      cargar_seccion_de_documentos() {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_documentos");
        return Promise.all([
          this.cargar_memoria_de_parametros(),
          this.cargar_memoria_de_reportes_absolutos(),
          this.cargar_memoria_de_reportes_relativos(true),
          this.cargar_datos_base_modificados(),
        ]);
      },
      async cargar_seccion_de_reporte() {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_reporte");
        return Promise.all([
          this.cargar_memoria_de_parametros(),
          this.cargar_memoria_de_reportes_absolutos(),
          this.cargar_memoria_de_reportes_relativos(true),
          this.cargar_datos_base_modificados(),
        ]);
      },
      async cargar_seccion_de_codigo() {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_codigo");
        return Promise.all([
          this.cargar_memoria_de_parametros(),
          this.cargar_memoria_de_reportes_absolutos(),
          this.cargar_memoria_de_reportes_relativos(true),
          this.cargar_datos_base_modificados(),
        ]);
      },
      async cargar_seccion_de_configuracion() {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_configuracion");
        return Promise.all([
          this.cargar_memoria_de_parametros(),
          this.cargar_memoria_de_reportes_absolutos(),
          this.cargar_memoria_de_reportes_relativos(true),
          this.cargar_datos_base_modificados(),
        ]);
      },
      async cargar_seccion_de_datos() {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_datos");
        return Promise.all([
          this.cargar_memoria_de_parametros(),
          this.cargar_memoria_de_reportes_absolutos(),
          this.cargar_memoria_de_reportes_relativos(true),
          this.cargar_datos_base_modificados(),
        ]);
      },
      aniadir_documento_de_reporte() {
        this.$utilidades.tracear("explorador_de_arbol.aniadir_documento");
        this.datos_de_reportes_relativos.documentos.push({
          uuid: this.generar_uuid(),
          nombre: this.generar_palabra(2, 5),
          modificador: "",
          plantilla: "",
          componente: "",
          documentos: []
        });
        return this.guardar_reportes_relativos();
      },
      guardar_reportes_relativos() {
        return new Promise(resolve => {
          this.set_por_id(this.explorador_raiz.datos_de_reportes_absolutos, this.identificador_de_ruta, this.datos_de_reportes_relativos);
          this.guardar_reportes_absolutos().then(() => {
            resolve();
          });
        });
      },
      guardar_reportes_absolutos() {
        return new Promise(resolve => {
          localStorage[this.identificador_de_reportes] = JSON.stringify(this.explorador_raiz.datos_de_reportes_absolutos);
          this.cargar_seccion(this.seccion_seleccionada).then(() => {
            resolve();
          });
        });
      },
      guardar_metadatos_de_reportes_relativos(nombre, modificador, plantilla, componente) {
        Object.assign(this.datos_de_reportes_relativos, { nombre, modificador, plantilla, componente });
        return this.guardar_reportes_relativos();
      },
      subir_documento(documento_index) {
        this.move_up_por_id(this.explorador_raiz.datos_de_reportes_absolutos, this.identificador_de_ruta.concat(["documentos", documento_index]));
        return this.guardar_reportes_absolutos();
      },
      bajar_documento(documento_index) {
        this.move_down_por_id(this.explorador_raiz.datos_de_reportes_absolutos, this.identificador_de_ruta.concat(["documentos", documento_index]));
        return this.guardar_reportes_absolutos();
      },
      confirmar_eliminar_documento(documento_index) {
        this.explorador_raiz.$refs.dialogo_de_confirmar_eliminar_reporte.showModal();
        const documento = this.get_por_id(this.explorador_raiz.datos_de_reportes_absolutos, this.identificador_de_ruta.concat(["documentos", documento_index]));
        this.documento_a_eliminar = documento;
        this.indice_de_documento_a_eliminar = documento_index;
        this.explorador_raiz.explorador_de_documento_a_eliminar = this;
      },
      cancelar_eliminar_documento() {
        this.explorador_raiz.$refs.dialogo_de_confirmar_eliminar_reporte.close();
        this.documento_a_eliminar = undefined;
        this.indice_de_documento_a_eliminar = undefined;
        this.explorador_raiz.explorador_de_documento_a_eliminar = undefined;
      },
      eliminar_documento() {
        const documento_index = this.explorador_raiz.explorador_de_documento_a_eliminar.indice_de_documento_a_eliminar;
        this.explorador_raiz.$refs.dialogo_de_confirmar_eliminar_reporte.close();
        Eliminar_documento_abierto_si_esta: {
          const documento = this.get_por_id(this.explorador_raiz.datos_de_reportes_absolutos, this.identificador_de_ruta.concat(["documentos", documento_index]));
          const posicion_de_documento = this.documentos_abiertos.indexOf(documento.uuid);
          this.documentos_abiertos.splice(posicion_de_documento, 1);
        }
        this.delete_por_id(this.explorador_raiz.datos_de_reportes_absolutos, this.identificador_de_ruta.concat(["documentos", documento_index]));
        this.cancelar_eliminar_documento();
        return this.guardar_reportes_absolutos();
      },
      confirmar_resetear_reportes() {
        this.explorador_raiz.$refs.dialogo_de_confirmar_resetear_reportes.showModal();
      },
      resetear_reportes() {
        delete localStorage[this.explorador_raiz.identificador_de_reportes];
        this.cancelar_resetear_reportes();
        return Promise.all([
          this.cargar_memoria_de_parametros(),
          this.cargar_memoria_de_reportes_absolutos(true),
          this.cargar_memoria_de_reportes_relativos(true),
          this.cargar_datos_base_modificados(),
        ]);
      },
      cancelar_resetear_reportes() {
        this.explorador_raiz.$refs.dialogo_de_confirmar_resetear_reportes.close();
      },
      limpiar_variables_de_importar_reportes() {
        
      },
      confirmar_importar_reportes(texto_a_importar, componente_de_seccion_de_configuracion) {
        this.texto_a_importar = texto_a_importar;
        this.componente_de_seccion_de_configuracion = componente_de_seccion_de_configuracion;
        this.explorador_raiz.$refs.dialogo_de_confirmar_importar_reportes.showModal();
      },
      importar_reportes() {
        try {
          const datos_a_importar = JSON.parse(this.texto_a_importar);
          if(typeof datos_a_importar !== "object") {
            throw new Error("Los datos a importar no son un objeto");
          }
          if(!("nombre" in datos_a_importar)) {
            throw new Error("Los datos a importar no tienen un nombre");
          }
          if(!("modificador" in datos_a_importar)) {
            throw new Error("Los datos a importar no tienen un modificador");
          }
          if(!("plantilla" in datos_a_importar)) {
            throw new Error("Los datos a importar no tienen una plantilla");
          }
          if(!("componente" in datos_a_importar)) {
            throw new Error("Los datos a importar no tienen un componente");
          }
          if(!("documentos" in datos_a_importar)) {
            throw new Error("Los datos a importar no tienen documentos");
          }
          localStorage[this.explorador_raiz.identificador_de_reportes] = this.texto_a_importar;
          return Promise.all([
            this.cargar_memoria_de_parametros(),
            this.cargar_memoria_de_reportes_absolutos(true),
            this.cargar_memoria_de_reportes_relativos(true),
            this.cargar_datos_base_modificados(),
            () => this.cancelar_importar_reportes()
          ]);
        } catch (error) {
          this.mostrar_error_de_importacion(error);
        }
      },
      cancelar_importar_reportes() {
        this.texto_a_importar = "";
        this.componente_de_seccion_de_configuracion = undefined;
        this.explorador_raiz.$refs.dialogo_de_confirmar_importar_reportes.close();
        this.mostrar_error_de_importacion(undefined);
      },
      mostrar_error_de_importacion(error) {
        this.error_de_importacion = error;
      },
    },
    mounted() {
      this.$utilidades.tracear("explorador_de_arbol.mounted");
      if(typeof this.seccion_seleccionada === "undefined") {
        if(this.es_explorador_raiz) {
          this.ir_a_seccion("reporte");
        } else {
          this.ir_a_seccion("documentos");
        }
      }
    },
  };
});