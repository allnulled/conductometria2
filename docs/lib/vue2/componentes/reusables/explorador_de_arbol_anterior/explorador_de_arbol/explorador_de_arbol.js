return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/reusables/explorador_de_arbol/explorador_de_arbol/explorador_de_arbol.js",
  "lib/vue2/componentes/reusables/explorador_de_arbol", [

], async function (mentemetria) {
  return {
    name: "explorador-de-arbol",
    templateUrl: "lib/vue2/componentes/reusables/explorador_de_arbol/explorador_de_arbol/explorador_de_arbol.xml",
    props: {
      nodoPadre: {
        type: Object,
        default: () => undefined
      },
      baseDeDatosDeReportes: {
        type: String,
        required: true
      },
      datosBase: {
        type: Object,
        required: true
      },
      exploradorPadre: {
        type: [Object, String],
        required: true,
      },
      exploradorRaiz: {
        type: [Object, String],
        required: true,
      },
      identificadorRelativo: {
        type: [Array, String],
        required: true
      }
    },
    data() {
      this.$utilidades.tracear("explorador_de_arbol.data");
      return {
        // Estáticos:
        explorador_raiz: typeof this.exploradorRaiz === "string" ? this : this.exploradorRaiz,
        es_raiz: typeof this.exploradorRaiz === "string",
        identificador_relativo: typeof this.identificadorRelativo === "string" ? [] : this.identificadorRelativo,
        esta_cargando_seccion: true,
        esta_cargando_datos: true,
        seccion_seleccionada: "documentos",
        seccion_de_documentos: {},
        seccion_de_visualizador: {},
        seccion_de_fuente: {},
        seccion_de_constructor_de_documento: {},
        // Dinámicos:
        datos_raiz: undefined,
        datos_relativos: undefined,
        datos: undefined,
        datos_modificados: undefined,
        nombre_del_reporte: "",
        modificador_del_reporte: "",
        reportador_del_reporte: "",
        documentos_del_reporte: []
      }
    },
    watch: {},
    methods: {
      ir_a_seccion(seccion) {
        this.$utilidades.tracear("explorador_de_arbol.ir_a_seccion");
        this.seccion_seleccionada = undefined;
        this.esta_cargando_seccion = true;
        this.seccion_seleccionada = seccion;
        setTimeout(() => {
          this.cargar_seccion(seccion).then(() => {
            this.esta_cargando_seccion = false;
          });
        }, 100);
      },
      cargar_seccion(seccion) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion");
        let hecho = undefined;
        const promesa = new Promise(function (ok, fail) {
          hecho = ok;
        });
        this["cargar_seccion_de_" + seccion.replaceAll(" ", "_")].call(this, hecho, promesa);
        return promesa;
      },
      cargar_seccion_de_documentos(hecho) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_documentos");
        this.cargar_datos();
        hecho();
      },
      cargar_seccion_de_visualizador(hecho) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_visualizador");
        hecho();
      },
      cargar_seccion_de_fuente(hecho) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_fuente");
        hecho();
      },
      cargar_seccion_de_constructor_de_documento(hecho) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_constructor_de_documento");
        hecho();
      },
      cargar_seccion_de_reporte(hecho) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_reporte");
        this.cargar_datos();
        hecho();
      },
      cargar_seccion_de_personalizar(hecho) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_seccion_de_personalizar");
        hecho();
      },
      cargar_datos_raiz(forzar = false) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_datos_raiz");
        if(this.explorador_raiz.datos_raiz && !forzar) {
          return this.explorador_raiz.datos_raiz;
        }
        const database_id = this.explorador_raiz.baseDeDatosDeReportes;
        // delete localStorage[database_id];
        if (!(database_id in localStorage)) {
          localStorage[database_id] = JSON.stringify({
            nombre: this.nombre_random(),
            modificador: "",
            reportador: "// función js que da datos y definiciones de interfaz",
            documentos: []
          });
        }
        this.explorador_raiz.datos_raiz = JSON.parse(localStorage[database_id]);
        return this.explorador_raiz.datos_raiz;
      },
      cargar_datos_relativos(forzar = false) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_datos_relativos");
        if(this.datos_relativos && !forzar) {
          return this.datos_relativos;
        }
        this.datos_relativos = this.filtrar_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo);
        return this.datos_relativos;
      },
      filtrar_con_identificador(datos, identificador) {
        this.$utilidades.tracear("explorador_de_arbol.filtrar_con_identificador");
        let val = datos;
        for(let index=0; index<identificador.length; index++) {
          const id_part = identificador[index];
          val = val[id_part];
        }
        return val;
      },
      establecer_con_identificador(datos, identificador, valor) {
        this.$utilidades.tracear("explorador_de_arbol.establecer_con_identificador");
        let val = datos;
        for(let index=0; index<identificador.length; index++) {
          const id_part = identificador[index];
          if(index === (identificador.length - 1)) {
            val[id_part] = valor;
          } else {
            val = val[id_part];
          }
        }
      },
      eliminar_item_de_array_con_identificador(datos, identificador, indice) {
        this.$utilidades.tracear("explorador_de_arbol.eliminar_item_de_array_con_identificador");
        let val = datos;
        for(let index=0; index<identificador.length; index++) {
          const id_part = identificador[index];
          val = val[id_part];
        }
        val.splice(indice, 1);
        return datos;
      },
      guardar_datos_raiz() {
        this.$utilidades.tracear("explorador_de_arbol.guardar_datos_raiz");
        const database_id = this.explorador_raiz.baseDeDatosDeReportes;
        const datos = this.explorador_raiz.datos_raiz;
        localStorage[database_id] = JSON.stringify(datos);
        this.$forceUpdate(true);
      },
      obtener_documentos() {
        this.$utilidades.tracear("explorador_de_arbol.obtener_documentos");
        // @DANGER: este código depende de los datos base
        if (this.explorador_raiz === this) {
          return this.datos_raiz.documentos;
        } else {
          // @WHAT????
          return this.datos_relativos.documentos;
          // throw new Error("La función «obtener_documentos» está por codificar todavía");
        }
      },
      obtener_datos_de_reporte() {
        this.$utilidades.tracear("explorador_de_arbol.obtener_datos_de_reporte");
        // @DANGER: este código depende de los datos base
        if (this.explorador_raiz === this) {
          return this.datos_raiz;
        } else {
          // @WHAT????
          return this.datos_relativos;
          // throw new Error("La función «obtener_documentos» está por codificar todavía");
        }
      },
      cargar_datos(forzar = false) {
        this.$utilidades.tracear("explorador_de_arbol.cargar_datos");
        // @DANGER: este código depende de los datos base
        this.esta_cargando_datos = true;
        if (this.explorador_raiz === this) {
          this.datos_raiz = this.cargar_datos_raiz(forzar);
          this.datos_modificados = this.datosBase;
          this.esta_cargando_datos = false;
        } else {
          // @WHAT???? IS IT OKAY?
          this.datos_relativos = this.cargar_datos_relativos(forzar);
          this.datos_modificados = this.datosBase;
          this.esta_cargando_datos = false;
          // throw new Error("La función «cargar_datos» está por codificar todavía");
        }
      },
      nombre_random(longitud = 5) {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let textoAleatorio = '';
        for (let i = 0; i < longitud; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          textoAleatorio += caracteres.charAt(indiceAleatorio);
        }
        return textoAleatorio;
      },
      aniadir_documento() {
        this.$utilidades.tracear("explorador_de_arbol.aniadir_documento");
        // @DANGER: este código depende de los datos base
        if (this.explorador_raiz === this) {
          this.explorador_raiz.datos_raiz.documentos.push({
            nombre: this.nombre_random(),
            modificador: "",
            reportador: "",
            documentos: []
          });
          this.guardar_datos_raiz();
        } else {
          // @WHAT???? IS IT OKAY?
          this.aniadir_documento_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo, {
            nombre: this.nombre_random(),
            modificador: "",
            reportador: "",
            documentos: []
          });
          this.guardar_datos_raiz();
          // throw new Error("La función «aniadir_documento» está por codificar todavía");
        }
      },
      aniadir_documento_con_identificador(datos, identificador, documento) {
        let val = datos;
        for(let index=0; index<identificador.length; index++) {
          const id_part = identificador[index];
          val = val[id_part];
        }
        val.documentos.push(documento);
      },
      eliminar_documento(indice_de_documento) {
        this.$utilidades.tracear("explorador_de_arbol.eliminar_documento");
        // @DANGER: este código depende de los datos base
        if (this.explorador_raiz === this) {
          let documentos = this.explorador_raiz.datos_raiz.documentos;
          documentos.splice(indice_de_documento, 1);
          this.explorador_raiz.datos_raiz.documentos = documentos;
          this.guardar_datos_raiz();
        } else {
          // @WHAT????
          this.explorador_raiz.datos_raiz = this.eliminar_item_de_array_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo.concat(["documentos"]), indice_de_documento);
          this.guardar_datos_raiz();
          this.exploradorPadre.ir_a_seccion("documentos");
          // throw new Error("La función «eliminar_documento» está por codificar todavía");
        }
      },
      subir_documento(indice_de_documento) {
        this.$utilidades.tracear("explorador_de_arbol.subir_documento");
        // @DANGER: este código depende de los datos base
        if (this.explorador_raiz === this) {
          let documentos = this.explorador_raiz.datos_raiz.documentos;
          if (indice_de_documento > 0) {
            documentos.splice(indice_de_documento - 1, 0, ...documentos.splice(indice_de_documento, 1));
            this.explorador_raiz.datos_raiz.documentos = documentos;
          }
          this.guardar_datos_raiz();
        } else {
          // @WHAT???? IS IT OKAY?
          this.subir_documento_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo, indice_de_documento);
          this.guardar_datos_raiz();
          // throw new Error("La función «subir_documento» está por codificar todavía");
        }
      },
      subir_documento_con_identificador(datos, identificador, indice_de_documento) {
        this.$utilidades.tracear("explorador_de_arbol.subir_documento_con_identificador");
        const documentos = this.filtrar_con_identificador(this.explorador_raiz.datos_raiz, identificador.concat(["documentos"]));
        if (indice_de_documento > 0) {
          documentos.splice(indice_de_documento - 1, 0, ...documentos.splice(indice_de_documento, 1));
          this.establecer_con_identificador(this.explorador_raiz.datos_raiz, identificador.concat(["documentos"]), documentos);
        }
      },
      bajar_documento(indice_de_documento) {
        this.$utilidades.tracear("explorador_de_arbol.bajar_documento");
        // @DANGER: este código depende de los datos base
        if (this.explorador_raiz === this) {
          const documentos = this.explorador_raiz.datos_raiz.documentos;
          if (indice_de_documento < documentos.length - 1) {
            documentos.splice(indice_de_documento + 1, 0, ...documentos.splice(indice_de_documento, 1));
            this.explorador_raiz.datos_raiz.documentos = documentos;
          }
          this.guardar_datos_raiz();
        } else {
          // @WHAT???? IS IT OKAY?
          this.bajar_documento_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo, indice_de_documento);
          this.guardar_datos_raiz();
          // throw new Error("La función «bajar_documento» está por codificar todavía");
        }
      },
      bajar_documento_con_identificador(datos, identificador, indice_de_documento) {
        this.$utilidades.tracear("explorador_de_arbol.bajar_documento_con_identificador");
        const documentos = this.filtrar_con_identificador(this.explorador_raiz.datos_raiz, identificador.concat(["documentos"]));
        if (indice_de_documento < documentos.length - 1) {
          documentos.splice(indice_de_documento + 1, 0, ...documentos.splice(indice_de_documento, 1));
          this.establecer_con_identificador(this.explorador_raiz.datos_raiz, identificador.concat(["documentos"]), documentos);
        }
      },
      guardar_personalizar_reporte(nombre, modificador, reportador) {
        this.$utilidades.tracear("explorador_de_arbol.guardar_personalizar_reporte");
        if(this.explorador_raiz === this) {
          this.explorador_raiz.datos_raiz.nombre = nombre;
          this.explorador_raiz.datos_raiz.modificador = modificador;
          this.explorador_raiz.datos_raiz.reportador = reportador;
          this.guardar_datos_raiz();
        } else {
          // @WHAT???? IS IT OKAY?
          // @TODO: alterar la parte del árbol correspondiente al identificador solamente
          console.log(this.explorador_raiz.datos_raiz);
          console.log(this.identificador_relativo);
          this.establecer_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo.concat(["nombre"]), nombre);
          this.establecer_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo.concat(["modificador"]), modificador);
          this.establecer_con_identificador(this.explorador_raiz.datos_raiz, this.identificador_relativo.concat(["reportador"]), reportador);
          this.guardar_datos_raiz();
          // throw new Error("La función «bajar_documento» está por codificar todavía");
        }
      }
    },
    mounted() {
      this.$utilidades.tracear("explorador_de_arbol.mounted");
      this.ir_a_seccion("documentos");
    },
  };
});