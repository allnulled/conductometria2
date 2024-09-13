# conductometria2

Calculadora de creencias y comportamiento.

## Instalar

Para acceder a la aplicación solo tienes que ir a:

- [https://allnulled.github.io/conductometria2/index.html](https://allnulled.github.io/conductometria2/index.html)

## Uso

```
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

definir { C } con {
  definición {{ C es una vitamina. }}
  categorías { vitaminas; minerales; nutrientes esenciales; nutrientes; }
  produce {
    { A } en +5min
  }
}

registrar 2024/09/15 donde {
  00:03 { A } 1h
  00:02 { A } 1h
  00:01 { A } 1h con matiz de {
    { C } +5min porque {{ he estado en modo intenso toda la carrera }}
  }
}

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