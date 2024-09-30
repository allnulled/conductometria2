{
  const eliminar_items_vacios_de_lista = function(lista) {
    const out = [];
    for(let index=0; index<lista.length; index++) {
      const item = lista[index];
      if(item !== "") {
        out.push(item);
      }
    }
    return out;
  }
}

Lenguaje = _* ast:Bloque_normal _* { return ast }

Bloque_normal = Sentencia_normal_completa+
Bloque_interior = Sentencia_normal_completa*

Sentencia_normal_completa = (
  Sentencia_de_definir_fenomeno /
  Sentencia_de_registrar_fenomenos /
  Sentencia_de_limitar_fenomenos
)

Token_con = "con"
Token_clave_curvada_abrir = "{"
Token_clave_curvada_abrir_negada = (!(Token_clave_curvada_abrir) .)* { return text().trim() }
Token_clave_curvada_cerrar = "}"
Token_clave_curvada_cerrar_negada = (!(Token_clave_curvada_cerrar) .)* { return text().trim() }
Token_doble_clave_curvada_o_semicolon_o_eol_negado = (!(Token_clave_curvada_cerrar / Token_semicolon / Token_EOL) .)* { return text().trim() }
Token_doble_clave_curvada_abrir = "{{"
Token_doble_clave_curvada_cerrar = "}}"
Token_doble_clave_curvada_cerrar_negada = (!(Token_doble_clave_curvada_cerrar) .)+ { return text().trim() }
Token_semicolon = ";"
Token_registrar = "registrar"
Token_EOF = !.
Token_EOL = ___
Token_EOL_negado = (!( Token_EOL / Token_EOF ) .)* { return text().trim() }

Sentencia_de_definir_fenomeno = ( Sentencia_de_definir_fenomeno_normal / Sentencia_de_definir_fenomeno_por_mencion )

Sentencia_de_definir_fenomeno_por_mencion = 
  token1:(_* "definir" _+)
  fenomeno:Fenomeno_enclavado
    { return { tipo:"sentencia de definir fenómeno", fenomeno, definicion: "-", categorias: [], sinonimos: [], antonimos: [], relativos: [], similares: [], precursores: [], es_producido_por: [], produce: [] } }

Sentencia_de_definir_fenomeno_normal = 
  token1:(_* "definir" _+)
  fenomeno:Fenomeno_enclavado
  token2:(_+ Token_con _* Token_clave_curvada_abrir )
  definicion:Definicion_de_fenomeno?
  categorias:Categorias_de_fenomeno?
  sinonimos:Sinonimos_de_fenomeno?
  antonimos:Antonimos_de_fenomeno?
  relativos:Relativos_de_fenomeno?
  similares:Similares_de_fenomeno?
  precursores:Precursores_de_fenomeno?
  consecuencias:Consecuencias_de_fenomeno?
  causas:Causas_de_fenomeno?
  token3:(_* Token_clave_curvada_cerrar )
    { return { tipo:"sentencia de definir fenómeno", fenomeno, definicion, categorias, sinonimos, antonimos, relativos, similares, precursores, es_producido_por: causas, produce: consecuencias } }

Fenomeno_enclavado =
  token1:(_* Token_clave_curvada_abrir)
  fenomeno:Token_clave_curvada_cerrar_negada
  token2:Token_clave_curvada_cerrar
    { return fenomeno }

Definicion_de_fenomeno = 
  token1:(_* "definición" _* Token_doble_clave_curvada_abrir )
  definicion:( Token_doble_clave_curvada_cerrar_negada )
  token2:(_* Token_doble_clave_curvada_cerrar )
    { return definicion }

Categorias_de_fenomeno = 
  token1:(_* "categorías" _* Token_clave_curvada_abrir )
  categorias:( Lista_de_categorias_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return eliminar_items_vacios_de_lista(categorias) }

Lista_de_categorias_de_fenomeno =
  item_1:Item_de_categoria_de_fenomeno_1
  items_n:Item_de_categoria_de_fenomeno_n*
    { return [item_1].concat(items_n || []) }

Item_de_categoria_de_fenomeno_1 =
  categoria:Token_doble_clave_curvada_o_semicolon_o_eol_negado
    { return categoria }

Item_de_categoria_de_fenomeno_n =
  token1:(Token_semicolon / Token_EOL)
  categoria:Token_doble_clave_curvada_o_semicolon_o_eol_negado
    { return categoria }

Sinonimos_de_fenomeno = 
  token1:(_* "sinónimos" _* Token_clave_curvada_abrir )
  categorias:( Lista_de_categorias_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return categorias }

Antonimos_de_fenomeno = 
  token1:(_* "antónimos" _* Token_clave_curvada_abrir )
  categorias:( Lista_de_categorias_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return categorias }

Relativos_de_fenomeno = 
  token1:(_* "relativos" _* Token_clave_curvada_abrir )
  categorias:( Lista_de_categorias_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return categorias }

Similares_de_fenomeno = 
  token1:(_* "similares" _* Token_clave_curvada_abrir )
  categorias:( Lista_de_categorias_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return categorias }

Precursores_de_fenomeno = 
  token1:(_* "precursores" _* Token_clave_curvada_abrir )
  categorias:( Lista_de_categorias_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return categorias }

Causas_de_fenomeno = 
  token1:(_* "es producido por" _* Token_clave_curvada_abrir _* )
  causas:( Lista_de_causas_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return causas }

Lista_de_causas_de_fenomeno = Item_de_causa_de_fenomeno*

Item_de_causa_de_fenomeno = 
  token1:(_*)
  fenomeno:Fenomeno_enclavado
  variacion:Subsentencia_de_en_mas_x_cantidad_de_tiempo
  cada:Subsentencia_de_cada_x_cantidad_de_tiempo?
  desde:Subsentencia_de_desde_x_cantidad_de_tiempo_o_puntos?
  hasta:Subsentencia_de_hasta_x_cantidad_de_tiempo_o_puntos?
    { return { tipo: "causa de fenómeno", fenomeno, variacion, desde, hasta, cada } }

Consecuencias_de_fenomeno = 
  token1:(_* "produce" _* Token_clave_curvada_abrir _* )
  consecuencias:( Lista_de_consecuencias_de_fenomeno )
  token2:(_* Token_clave_curvada_cerrar )
    { return consecuencias }

Lista_de_consecuencias_de_fenomeno = Item_de_consecuencia_de_fenomeno*

Item_de_consecuencia_de_fenomeno = 
  token1:(_*)
  fenomeno:Fenomeno_enclavado
  variacion:Subsentencia_de_en_mas_x_cantidad_de_tiempo
  cada:Subsentencia_de_cada_x_cantidad_de_tiempo?
  desde:Subsentencia_de_desde_x_cantidad_de_tiempo_o_puntos?
  hasta:Subsentencia_de_hasta_x_cantidad_de_tiempo_o_puntos?
    { return { tipo: "consecuencia de fenómeno", fenomeno, variacion, cada, desde, hasta } }

Subsentencia_de_en_mas_x_cantidad_de_tiempo = 
  token1:( _* "en" _+ )
  incremento:( Tipo_incremento_de_cantidad_de_tiempo )
    { return incremento }

Subsentencia_de_desde_x_cantidad_de_tiempo_o_puntos = 
  token1:( _* "desde" _+ )
  desde:( Tipo_cantidad_de_tiempo / Tipo_puntos )
    { return desde }

Subsentencia_de_hasta_x_cantidad_de_tiempo_o_puntos = 
  token1:( _* "hasta" _+ )
  hasta:( Tipo_cantidad_de_tiempo / Tipo_puntos )
    { return hasta }

Subsentencia_de_cada_x_cantidad_de_tiempo = 
  token1:( _* "cada" _+ )
  cada:( Tipo_cantidad_de_tiempo )
    { return cada }

Tipo_incremento_de_puntos = 
  polaridad:("-" / "+")
  cantidad:Numero_decimal_no_polar
  token1:("p")
    { return { tipo: "cantidad de incremento de puntos", polaridad, cantidad } }

Tipo_puntos =
  cantidad:Numero_decimal_no_polar
  token1:("p")
    { return { tipo: "cantidad de puntos", cantidad } }

Tipo_incremento_de_cantidad_de_tiempo =
  polaridad:("-" / "+")
  cantidad:Tipo_cantidad_de_tiempo
    { return { tipo: "cantidad de incremento de tiempo", polaridad, cantidad } }

Tipo_cantidad_de_tiempo =
  tipo:( Tipo_cantidad_de_tiempo_segun_dias / Tipo_cantidad_de_tiempo_segun_horas / Tipo_cantidad_de_tiempo_segun_minutos )
    { return tipo }

Tipo_cantidad_de_tiempo_segun_dias = 
  dias:Subtipo_cantidad_de_dias
  horas:Subtipo_cantidad_de_horas?
  minutos:Subtipo_cantidad_de_minutos?
    { return { tipo: "cantidad de tiempo", dias, horas, minutos } }

Tipo_cantidad_de_tiempo_segun_horas = 
  horas:Subtipo_cantidad_de_horas
  minutos:Subtipo_cantidad_de_minutos?
    { return { tipo: "cantidad de tiempo", dias: null, horas, minutos } }

Tipo_cantidad_de_tiempo_segun_minutos = 
  minutos:Subtipo_cantidad_de_minutos
    { return { tipo: "cantidad de tiempo", dias: null, horas: null, minutos } }

Subtipo_cantidad_de_dias = _* dias:Numero_decimal_no_polar "d" { return dias }
Subtipo_cantidad_de_horas = _* horas:Numero_decimal_no_polar "h" { return horas }
Subtipo_cantidad_de_minutos = _* minutos:Numero_decimal_no_polar "min" { return minutos }

Tipo_dia_del_calendario =
  anyo:Subtipo_anyo_del_calendario
  token1:("/")
  mes:Subtipo_mes_del_calendario
  token2:("/")
  dia:Subtipo_dia_del_calendario
    { return { tipo: "día del calendario", anyo, mes, dia } }

Subtipo_anyo_del_calendario = [0-9] [0-9] [0-9] [0-9] { return parseInt(text()) }
Subtipo_mes_del_calendario = [0-1] [0-9] { return parseInt(text()) }
Subtipo_dia_del_calendario = [0-3] [0-9] { return parseInt(text()) }

Tipo_hora_del_dia =
  hora:Subtipo_hora_del_dia
  token1:(":")
  minuto:Subtipo_minuto_del_dia
  ampm:("am"/"pm")?
    { return { tipo: "hora del día", hora, minuto } }

Subtipo_hora_del_dia = [0-2] [0-9] { return parseInt(text()) }
Subtipo_minuto_del_dia = [0-5] [0-9] { return parseInt(text()) }

Numero_decimal_no_polar = [0-9]+ ( "." [0-9]+ )? { return parseFloat(text()) }

Sentencia_de_registrar_fenomenos = 
  token1:(_* Token_registrar _+)
  dia:Tipo_dia_del_calendario
  token2:(_+ ("donde"/"con") _* Token_clave_curvada_abrir )
  registros:Subsentencia_registro_de_fenomeno_en_hora*
  token3:(_* Token_clave_curvada_cerrar )
    { return { tipo: "sentencia de registrar fenómenos", dia, registros } }

Subsentencia_registro_de_fenomeno_en_hora = 
  token1:(_*)
  estado:("+"/"-"/"!"/"")
  token2:(_*)
  hora:Tipo_hora_del_dia
  token3:(_*)
  fenomeno:Fenomeno_enclavado
  token4:(_*)
  duracion:Tipo_cantidad_de_tiempo
  token5:(_*)
  matices:Subsentencia_matices_de_registro?
    { return { tipo: "registro de fenómeno en hora", estado: estado === "" ? "+" : estado, hora, fenomeno, duracion, matices } }

Subsentencia_matices_de_registro =
  token1:(_* "con" (_+ "matiz de")? _* Token_clave_curvada_abrir )
  matices:Subsentencia_matiz_de_registro*
  token2:(_* Token_clave_curvada_cerrar )
    { return matices }

Subsentencia_matiz_de_registro = 
  token1:(_*)
  fenomeno:Fenomeno_enclavado
  token2:(_*)
  modificacion:Tipo_incremento_de_cantidad_de_tiempo
  token3:(_*)
  porque:Subsentencia_porque?
    { return { tipo: "matiz de registro de fenómeno", fenomeno, modificacion, porque } }

Subsentencia_porque = 
  token1:(_* "porque" _* Token_doble_clave_curvada_abrir )
  porque:( Token_doble_clave_curvada_cerrar_negada )
  token2:(_* Token_doble_clave_curvada_cerrar )
    { return porque }

Sentencia_de_limitar_fenomenos = 
  token1:(_* "limitar" _+ "entre" _+ )
  inicio:Tipo_dia_del_calendario
  token2:(_* "y" _+ )
  final:Tipo_dia_del_calendario
  token3:(_* Token_clave_curvada_abrir )
  horas:Subsentencia_entre_horas*
  token4:(_* Token_clave_curvada_cerrar )
    { return { tipo: "sentencia de limitar fenómenos", intervalo_de_dias: { inicio, final }, horas } }

Subsentencia_entre_horas = 
  token1:(_* "entre" _+ )
  inicio:Tipo_hora_del_dia
  token2:(_* "y" _+ )
  final:Tipo_hora_del_dia
  token3:(_* Token_clave_curvada_abrir )
  limites:Subsentencia_limites_de_fenomenos
  token4:(_* Token_clave_curvada_cerrar )
    { return { intervalo_de_horas: { inicio, final }, limites } }

Subsentencia_limites_de_fenomenos = Subsentencia_limite_de_fenomeno*

Subsentencia_limite_de_fenomeno = 
  token1:(_*)
  fenomeno:Fenomeno_enclavado
  cada:Subsentencia_cada_cantidad_de_tiempo?
  minimo:Subsentencia_minimo_cantidad_de_tiempo?
  maximo:Subsentencia_maximo_cantidad_de_tiempo?
  mensajes:Subsentencia_con_mensajes_para_menos_igual_y_mas?
    { return { tipo: "límite de fenómeno", fenomeno, cada, minimo, maximo, mensajes } }

Subsentencia_cada_cantidad_de_tiempo = 
  token1:(_* "cada" _+)
  tiempo:Tipo_cantidad_de_tiempo
    { return tiempo }

Subsentencia_minimo_cantidad_de_tiempo = 
  token1:(_* "mínimo" _+)
  tiempo:Tipo_cantidad_de_tiempo
    { return tiempo }

Subsentencia_maximo_cantidad_de_tiempo = 
  token1:(_* "máximo" _+)
  tiempo:Tipo_cantidad_de_tiempo
    { return tiempo }

Subsentencia_con_mensajes_para_menos_igual_y_mas = 
  token1:(_* "con mensajes" _* Token_clave_curvada_abrir)
  minimo:Mensaje_para_minimo_excedido?
  valido:Mensaje_para_limite_valido?
  maximo:Mensaje_para_maximo_excedido?
  token2:(_* Token_clave_curvada_cerrar)
    { return { minimo, valido, maximo } }

Mensaje_para_minimo_excedido = 
  token1:(_* "-" _*)
  mensaje:Mensaje_en_doble_clave
    { return mensaje }

Mensaje_para_limite_valido = 
  token1:(_* "=" _*)
  mensaje:Mensaje_en_doble_clave
    { return mensaje }
    
Mensaje_para_maximo_excedido = 
  token1:(_* "+" _*)
  mensaje:Mensaje_en_doble_clave
    { return mensaje }
    
Mensaje_en_doble_clave =
  token1:(_* Token_doble_clave_curvada_abrir )
  mensaje:( Token_doble_clave_curvada_cerrar_negada )
  token2:(_* Token_doble_clave_curvada_cerrar )
    { return mensaje }

Token_inicio_comentario_unilinea = "//"
Token_inicio_comentario_multilinea = "/*"
Token_fin_comentario_multilinea = "*/"
Token_fin_comentario_multilinea_negado = (!(Token_fin_comentario_multilinea) .)*

Comentario = comentario:(Comentario_unilinea / Comentario_multilinea)
Comentario_unilinea = Token_inicio_comentario_unilinea Token_EOL_negado Token_EOL
Comentario_multilinea = 
  token1:Token_inicio_comentario_multilinea
  comentario:Token_fin_comentario_multilinea_negado
  token2:Token_fin_comentario_multilinea

_ = Comentario / __ / ___
__ = " " / "\t"
___ = "\r\n" / "\r" / "\n"