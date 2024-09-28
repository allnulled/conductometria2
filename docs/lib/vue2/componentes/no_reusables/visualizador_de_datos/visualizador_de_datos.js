return await Sistema_de_modulos.definir_componente_vue2(
  "lib/vue2/componentes/no_reusables/visualizador_de_datos/visualizador_de_datos.js",
  "lib/vue2/componentes/no_reusables/visualizador_de_datos", [

], async function (mentemetria) {
  return {
    name: "visualizador-de-datos",
    templateUrl: "lib/vue2/componentes/no_reusables/visualizador_de_datos/visualizador_de_datos.xml",
    props: ["datos"],
    data() {
      this.$utilidades.tracear("visualizador_de_datos.data");
      return {
        esta_expandido: true,
      }
    },
    watch: {
      
    },
    computed: {
      datos_es_objeto() {
        return typeof this.datos === 'object';
      },
      datos_es_nulo() {
        return this.datos === null;
      },
      datos_es_objeto_con_claves() {
        return this.datos_es_objeto && Object.keys(this.datos).length;
      },
      datos_es_objeto_vacio() {
        return this.datos_es_objeto && (Object.keys(this.datos).length === 0);
      },
      datos_es_objeto_normal() {
        return this.datos_es_objeto && (!this.datos_es_array) && (!this.datos_es_nulo) && !this.datos_es_objeto_vacio;
      },
      datos_es_indefinido() {
        return typeof this.datos === "undefined";
      },
      datos_es_array() {
        return Array.isArray(this.datos);
      },
      datos_es_array_con_claves() {
        return this.datos_es_array && this.datos.length;
      },
      datos_es_array_vacio() {
        return this.datos_es_array && (this.datos.length === 0);
      },
      datos_es_array_normal() {
        return this.datos_es_array && (!this.datos_es_array_vacio);
      },
      datos_es_texto() {
        return typeof this.datos === "string";
      },
      datos_es_numero() {
        return typeof this.datos === "number";
      },
      datos_es_funcion() {
        return typeof this.datos === "function";
      },
      datos_es_booleano() {
        return typeof this.datos === "boolean";
      }
    },
    methods: {
      alternar_expansion() {
        this.esta_expandido = !this.esta_expandido;
      },
      es_objeto_o_array_normal(objetivo) {
        const es_objeto_normal = (typeof objetivo === "object") && (objetivo !== null) && (Object.keys(objetivo).length);
        const es_array_normal = (typeof objetivo === "object") && Array.isArray(objetivo) && objetivo.length;
        return es_objeto_normal || es_array_normal;
      },
      es_tipo_conocido(dato) {
        const tipos_conocidos = [
          'hora del día',
          'sentencia de definir fenómeno',
          'consecuencia de fenómeno',
          'cantidad de incremento de tiempo',
          'cantidad de tiempo',
          'sentencia de registrar fenómenos',
          'día del calendario',
          'registro de fenómeno en hora',
          'matiz de registro de fenómeno',
          'sentencia de limitar fenómenos',
          'límite de fenómeno',
          'registro de fenómeno en propagación',
          'punto causal según «produce»',
          'punto causal según matiz',
          'registro de fenómeno por matiz',
          'acumulación fenoménica',
          'unidad de acumulación fenoménica',
          'notificación'
        ];
        return (typeof dato === "object") && (dato !== null) && (typeof dato.tipo === "string") && (tipos_conocidos.indexOf(dato.tipo) !== -1);
      }
    },
    mounted() {
        
    },
  };
});