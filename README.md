# Mariano Witte · Profesor de Pádel

Webapp informativa y de captación de alumnos para Mariano Witte, profesor de pádel con más de 15 años de experiencia. Permite a los interesados elegir un plan mensual y enviar un mensaje completo a Mariano por WhatsApp.

## Estructura

```
mariano-witte-padel/
├── index.html      # Estructura principal
├── styles.css      # Estilos completos
├── app.js          # Lógica de precios y wizard
├── netlify.toml    # Config de Netlify
└── README.md
```

## Funcionalidades

- Hero con branding impactante
- Sección "Sobre mí" con estadísticas
- Planes mensuales con toggle por modalidad (Individual / Dupla / Trío / Clínica)
- Plan Entrenamiento Intensivo para torneos
- Precios por clase suelta de referencia
- Wizard de 7 pasos que recaba: nombre, teléfono, nivel, objetivo, frecuencia semanal, horario preferido y forma de pago
- Generación automática de mensaje WhatsApp con todos los datos y precio final

## Cómo subir a GitHub

```bash
# 1. Crear repositorio en github.com (ej: mariano-witte-padel)

# 2. Desde esta carpeta:
git init
git add .
git commit -m "feat: landing page inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mariano-witte-padel.git
git push -u origin main
```

## Cómo conectar con Netlify

1. Ir a [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Conectar tu cuenta de GitHub y seleccionar el repositorio `mariano-witte-padel`
3. Configuración de build:
   - **Publish directory:** `.` (el punto, raíz del proyecto)
   - Dejar Build command vacío
4. Clic en **Deploy site**
5. Netlify genera una URL automática. Podés personalizarla en **Domain settings**.

Cada `git push` a `main` despliega automáticamente.

## Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Foto del profesor | Reemplazar `.photo-placeholder` en `index.html` con un `<img>` |
| Teléfono WhatsApp | `app.js` línea con `const tel = '543855864210'` |
| Precios base | `app.js` objeto `BASE_PRICES` |
| Descuentos | `app.js` array `PACKS` |
| Precio intensivo | `app.js` función `getPack()` → rama `isTorneo` |
| Colores | `styles.css` bloque `:root` |

## Agregar fotos reales

Reemplazá el bloque `.photo-placeholder` en `index.html` con:

```html
<img src="foto-mariano.jpg" alt="Mariano Witte" style="width:100%;height:100%;object-fit:cover;border-radius:18px;" />
```

Subí la foto al repositorio junto a los demás archivos.
