// Definir el componente Vue
Vue.component('mi-texteditor', {
  props: {
    placeholder: {
      type: String,
      default: function() { return "" }
    },
    onChange: {
      type: Function,
      default: function() {}
    },
    onFocus: {
      type: Function,
      default: function() {}
    },
    onBlur: {
      type: Function,
      default: function() {}
    },
    texto: {
      type: String,
      default: () => ""
    }
  },
  template: `
    <div class="mi_texteditor">
      <textarea ref="editor_de_texto" v-model="inputValue" spellcheck="false" :placeholder="placeholder"></textarea>
      <div class="panel_de_botones_de_mi_texteditor">
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
        this.$refs.editor_de_texto.style.fontFamily = "monospace";
      } else {
        this.familia_de_letra = "normal";
        this.$refs.editor_de_texto.style.fontFamily = "Roboto";
      }
    },
    incrementar_letra() {
      this.tamanio_de_letra++;
      this.$refs.editor_de_texto.style.fontSize = this.tamanio_de_letra + "px";
    },
    decrementar_letra() {
      this.tamanio_de_letra--;
      this.$refs.editor_de_texto.style.fontSize = this.tamanio_de_letra + "px";
    },
  },
  watch: {
    inputValue(v) {
      this.onChange(v);
    }
  }
});
