# conductometria2

Calculadora de creencias y comportamiento.

## Instalar

Para acceder a la aplicación solo tienes que ir a:

- [https://allnulled.github.io/conductometria2/index.html](https://allnulled.github.io/conductometria2/index.html)

## Uso

```
/* Script de ejemplo */

// Lección 1. Puedes definir fenómenos con solo el nombre:

definir { actividad 1 }
definir { actividad 2 }
definir { actividad 3 }
definir { actividad 4 }
definir { actividad 5 }

// Lección 2. Puedes definir fenómenos con más propiedades:

definir { A } con {
  definición {{ A es una vitamina. }}
  categorías { vitaminas; minerales; nutrientes esenciales; nutrientes; }
  produce {
    { B } en +5min cada 10min
  }
}

definir { B } con {
  definición {{ B es una vitamina. }}
  categorías { vitaminas; minerales; nutrientes esenciales; nutrientes; }
  produce {
    
  }
}

// Lección 3. Puedes definir fenómenos con más propiedades todavía:

definir { C } con {
  definición {{ C es una vitamina. }}
  categorías { vitaminas; minerales; nutrientes esenciales; nutrientes; }
  sinónimos { se separan; con punto y coma; o salto de línea; }
  antónimos { se separan; con punto y coma; o salto de línea; }
  relativos { se separan; con punto y coma; o salto de línea; }
  similares { se separan; con punto y coma; o salto de línea; }
  precursores { se separan; con punto y coma; o salto de línea; }
  produce {
    { A } en +5min cada 2h desde 1h hasta 4h
  }
  es producido por {
    { Z } en +5min cada 2h desde 1h hasta 4h
  }
}

// Lección 4. Puedes registrar fenómenos en un día:

registrar 2024/09/15 donde {
  00:03 { A } 1h
  00:02 { A } 1h
  00:01 { A } 1h con matiz de {
    { C } +5min porque {{ he estado en modo intenso toda la carrera }}
  }
}

// Lección 5. Puedes programar notificaciones para limitar los fenómenos con mínimos o máximos:

limitar entre 2024/08/15 y 2025/08/15 {
  entre 00:00 y 23:59 {
    { A } mínimo 0min máximo 1h con mensajes {
        - {{ vitamina A escasea }}
        = {{ vitamina A está equilibrada }}
        + {{ vitamina A rebosa }}
    }
    { B } cada 2h mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
    { B } mínimo 0min máximo 30min
  }
}

```