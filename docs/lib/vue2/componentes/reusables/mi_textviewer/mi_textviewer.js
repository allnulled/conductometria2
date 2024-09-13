// Definir el componente Vue
Vue.component('mi-textviewer', {
  props: {
    texto: {
      type: String,
      default: () => ""
    },
    habilitado: {
      type: Boolean,
      default: () => false
    }
  },
  template: `
    <div class="mi_textviewer">
      <textarea ref="visor_de_texto" disabled="!habilitado" v-model="inputValue" spellcheck="false"></textarea>
      <div class="panel_de_botones_de_mi_textviewer">
        <button class="min_width_0" v-on:click="alternar_letra">F</button>
        <button class="min_width_0" v-on:click="decrementar_letra">-</button>
        <button class="min_width_0" v-on:click="incrementar_letra">+</button>
      </div>
    </div>
  `,
  data: function() {
    return {
      inputValue: this.texto,
      familia_de_letra: "normal",
      tamanio_de_letra: 12,
    };
  },
  methods: {
    setInputValue(value) {
      this.inputValue = value;
    },
    alternar_letra() {
      if(this.familia_de_letra === "normal") {
        this.familia_de_letra = "monoespaciado";
        this.$refs.visor_de_texto.style.fontFamily = "monospace";
      } else {
        this.familia_de_letra = "normal";
        this.$refs.visor_de_texto.style.fontFamily = "Roboto";
      }
    },
    incrementar_letra() {
      this.tamanio_de_letra++;
      this.$refs.visor_de_texto.style.fontSize = this.tamanio_de_letra + "px";
    },
    decrementar_letra() {
      this.tamanio_de_letra--;
      this.$refs.visor_de_texto.style.fontSize = this.tamanio_de_letra + "px";
    },
  },
  watch: {
    
  }
});
