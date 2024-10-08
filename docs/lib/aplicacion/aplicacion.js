Sistema_de_modulos.definir("lib/aplicacion", [
  "vue",
  "vue-router",
  "vue-i18n",
  "lib/rutas",
  "lib/traducciones",
], async function (Vue, VueRouter, VueI18n, rutas, traducciones) {

  Vue.config.productionTip = false;

  /* INTERNATIONALIZATION */
  const i18n = new VueI18n({
    locale: "es",
    fallbackLocale: "en",
    messages: traducciones
  });

  /* FRAMEWORK */
  window.Vue = Vue;

  /* ROUTER */
  Vue.use(VueRouter);
  const router = new VueRouter({
    routes: rutas
  });

  /* UNIVERSAL GLOBALS */
  Vue.prototype.$window = window;
  Vue.prototype.$sistema_de_modulos = Sistema_de_modulos;
  Vue.prototype.$utilidades = await Sistema_de_modulos.cargar_modulo("lib/utilidades_globales");

  /* VUE */
  const vue = new Vue({
    router,
    i18n,
    render: h => h(Vue.options.components.app),
  }).$mount("#app");

  
  return vue;

});