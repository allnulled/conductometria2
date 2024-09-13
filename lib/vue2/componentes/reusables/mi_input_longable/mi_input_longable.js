// Definir el componente Vue
Vue.component('mi-input-longable', {
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
    onEnter: {
      type: Function,
      default: function() {}
    }
  },
  template: `
    <div class="mi_input_longable">
      <template v-if="esta_expandido">
        <div class="position_relative">
          <mi-texteditor ref="editor_de_texto" :on-focus="onFocus" :on-blur="onBlur" :placeholder="placeholder" :on-change="actualizar_valor" :texto="inputValue" />
          <div class="position_absolute" style="top:5px; bottom:auto; left:auto; right:5px;">
            <button v-on:click="alternar_expansion">Contraer</button>
          </div>
        </div>
      </template>
      <template v-else="">
        <table class="width_100 border_collapse_collapse">
          <tbody>
            <tr>
              <td class="width_100">
                <input ref="caja_de_texto" class="width_100" type="text" v-model="inputValue" v-on:focus="onFocus" v-on:blur="onBlur" spellcheck="false" :placeholder="placeholder" v-on:keydown.enter="onEnter" />
              </td>
              <td class="width_auto">
                <button v-on:click="alternar_expansion">Expandir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>`,
  data: function() {
    return {
      inputValue: '',
      esta_expandido: false,
    };
  },
  watch: {
    inputValue: function(value) {
      this.onChange(value);
    }
  },
  methods: {
    setInputVale(value) {
      this.inputValue = value;
    },
    alternar_expansion() {
      this.esta_expandido = !this.esta_expandido;
      if(this.esta_expandido) {
        setTimeout(() => {
          this.$refs.editor_de_texto.$el.querySelector("textarea").focus();
        }, 0);
      } else {
        setTimeout(() => {
          this.$refs.caja_de_texto.focus();
        }, 0);
      }
    },
    actualizar_valor(value) {
      this.inputValue = value;
    }
  }
});
