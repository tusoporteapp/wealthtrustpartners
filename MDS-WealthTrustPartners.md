# 📘 Manual de Estilo (MDS) — Wealth Trust Partners

> **Versión:** 1.0  
> **Fecha:** Septiembre 2026  
> **Sitio web:** [wealthtrustpartners.com](https://wealthtrustpartners.com)  
> **Sector:** Gestión Patrimonial · Inversiones · Wealth Management · Panamá

---

## 1. Identidad de Marca

**Nombre oficial:** Wealth Trust Partners  
**Tagline:** _Su aliado estratégico para invertir en Panamá_  
**Tono de voz:** Profesional, confiable, sofisticado, cercano pero formal.  
**Personalidad:** Exclusividad, solidez financiera, confianza, transparencia.

---

## 2. Paleta de Colores

### 2.1 Colores Principales

| Nombre             | Muestra | HEX       | RGB              | Uso Principal                                                |
|--------------------|---------|-----------|------------------|--------------------------------------------------------------|
| **Dorado WTP**     | 🟡      | `#C9A84C` | `201, 168, 76`   | Color de marca principal. CTAs, acentos, íconos, enlaces     |
| **Navy Oscuro**    | 🔷      | `#0A1628` | `10, 22, 40`     | Títulos, fondos premium, secciones hero                      |
| **Navy Superficie**| 🔹      | `#152238` | `21, 34, 56`     | Cards y paneles sobre fondos oscuros                         |
| **Gris Carbón**    | ⚫      | `#2C2C2C` | `44, 44, 44`     | Texto principal del body                                     |
| **Crema Claro**    | 🟫      | `#F8F6F0` | `248, 246, 240`  | Fondos de secciones alternadas (light-background)            |
| **Blanco**         | ⬜      | `#FFFFFF` | `255, 255, 255`  | Fondo principal, texto sobre fondos oscuros                  |

### 2.2 Colores Secundarios / Soporte

| Nombre             | Muestra | HEX       | RGB              | Uso                                                          |
|--------------------|---------|-----------|------------------|--------------------------------------------------------------|
| **Gris Medio**     | 🔘      | `#a0a5aa` | `160, 165, 170`  | Texto secundario, logos de aliados, elementos de baja jerarquía |
| **Gris Borde**     | ⚪      | `#f0f0f0` | `240, 240, 240`  | Bordes sutiles, separadores                                  |

### 2.3 Colores de Sistema (funcionales)

| Nombre             | HEX       | Uso                          |
|--------------------|-----------|------------------------------|
| **Éxito / Verde**  | `#059652` | Confirmaciones, mensajes ok  |
| **Error / Rojo**   | `#df1529` | Errores, alertas críticas    |
| **Warning / Amarillo** | `#ffc107` | Alertas, advertencias    |

### 2.4 Reglas de Uso de Color

- ✅ El **Dorado `#C9A84C`** se usa siempre como color de acento, nunca como fondo completo de sección.
- ✅ Sobre fondos oscuros (`#0A1628`), el texto debe ser **blanco `#FFFFFF`**.
- ✅ Sobre fondos claros (`#FFFFFF` o `#F8F6F0`), los títulos van en **Navy `#0A1628`** y el cuerpo en **Gris `#2C2C2C`**.
- ✅ Los enlaces siempre usan el dorado `#C9A84C` y al hover se aclaran un 25%.
- ❌ No usar colores fuera de esta paleta para mantener coherencia de marca.
- ❌ No usar el dorado sobre fondos amarillos o claros donde pierda contraste.

---

## 3. Tipografías

### 3.1 Fuentes Principales

| Fuente         | Tipo         | Uso                                      | Pesos Principales         |
|----------------|-------------|------------------------------------------|---------------------------|
| **Raleway**    | Sans-serif  | Títulos (`h1` – `h6`)                    | 600 (Semi-Bold), 700 (Bold) |
| **Poppins**    | Sans-serif  | Navegación, botones, labels, subtítulos  | 500 (Medium), 600 (Semi-Bold), 700 (Bold) |
| **Roboto**     | Sans-serif  | Texto de cuerpo, párrafos, descripciones | 300 (Light), 400 (Regular), 500 (Medium) |

### 3.2 Fuente Auxiliar

| Fuente         | Tipo   | Uso                                      |
|----------------|--------|------------------------------------------|
| **Georgia**    | Serif  | Logos de partners financieros simulados   |

### 3.3 Carga de Fuentes (Google Fonts)

```
https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap
```

### 3.4 Jerarquía Tipográfica

| Elemento        | Fuente     | Tamaño Sugerido | Peso  | Color                     |
|-----------------|-----------|-----------------|-------|---------------------------|
| H1 (Hero)       | Raleway   | 48–56px         | 700   | `#FFFFFF` (sobre hero oscuro) |
| H2 (Secciones)  | Raleway   | 32–36px         | 700   | `#0A1628`                 |
| H3 (Subtítulos) | Raleway   | 24–28px         | 600   | `#0A1628`                 |
| H4–H6           | Raleway   | 18–22px         | 600   | `#0A1628`                 |
| Párrafo (body)  | Roboto    | 16px            | 400   | `#2C2C2C`                 |
| Navegación      | Poppins   | 15px (desktop)  | 400   | `#FFFFFF` (header transparente) |
| Nav Mobile      | Poppins   | 17px            | 500   | `#2C2C2C`                 |
| Botón CTA       | Poppins   | 14px            | 600   | `#FFFFFF`                 |
| Caption / Small | Roboto    | 12–14px         | 300   | `#a0a5aa`                 |
| Footer          | Roboto    | 14px            | 400   | Hereda del fondo          |

---

## 4. Botones y CTAs

### 4.1 Botón Primario (CTA Principal)

```css
background-color: #C9A84C;
color: #FFFFFF;
border-radius: 5px;
font-family: 'Poppins', sans-serif;
font-weight: 600;
font-size: 14px;
padding: 10px 24px;
border: none;
transition: 0.3s;
```

**Hover:** El fondo se aclara (`color-mix(in srgb, #C9A84C, transparent 25%)`).

### 4.2 Botón CTA sobre Fondo Oscuro

```css
background-color: #C9A84C;
color: #0A1628;
border-color: #C9A84C;
font-weight: bold;
border-radius: 5px;
```

### 4.3 Reglas de Botones

- ✅ Siempre usar `border-radius: 5px` (esquinas ligeramente redondeadas).
- ✅ La transición de hover es siempre `0.3s`.
- ✅ Texto de botón en **Poppins Semi-Bold**.
- ❌ No usar botones completamente cuadrados ni completamente redondos (pill).

---

## 5. Esquemas de Fondo (Secciones)

### 5.1 Fondo Default (Claro)

| Propiedad       | Valor       |
|-----------------|-------------|
| Fondo           | `#FFFFFF`   |
| Texto           | `#2C2C2C`   |
| Títulos         | `#0A1628`   |
| Superficie      | `#FFFFFF`   |
| Acento          | `#C9A84C`   |

### 5.2 Fondo Light (Alternado)

| Propiedad       | Valor       |
|-----------------|-------------|
| Fondo           | `#F8F6F0`   |
| Texto           | `#2C2C2C`   |
| Títulos         | `#0A1628`   |
| Superficie      | `#FFFFFF`   |

### 5.3 Fondo Dark (Premium)

| Propiedad       | Valor       |
|-----------------|-------------|
| Fondo           | `#0A1628`   |
| Texto           | `#FFFFFF`   |
| Títulos         | `#FFFFFF`   |
| Superficie      | `#152238`   |
| Contraste       | `#FFFFFF`   |

---

## 6. Navegación

| Propiedad                    | Valor                |
|------------------------------|----------------------|
| Color texto nav (desktop)    | `#FFFFFF`            |
| Color hover nav              | `#C9A84C`            |
| Fondo nav mobile             | `#FFFFFF`            |
| Color dropdown               | `#2C2C2C`            |
| Hover dropdown               | `#C9A84C`            |
| Fondo dropdown               | `#FFFFFF`            |
| Header fondo                 | Transparente (`rgba(255,255,255,0)`) |
| Header scrolled              | Sombra `0px 0px 30px rgba(0,0,0,0.1)` |

---

## 7. Enlaces

| Estado       | Estilo                                                  |
|-------------|----------------------------------------------------------|
| Default     | Color `#C9A84C`, sin subrayado                           |
| Hover       | Se aclara 25% (`color-mix(in srgb, #C9A84C, transparent 25%)`) |
| Transición  | `0.3s ease`                                              |

---

## 8. Espaciado y Layout

| Elemento         | Valor                            |
|-----------------|----------------------------------|
| Scroll           | `scroll-behavior: smooth`       |
| Footer padding   | `30px 0`                        |
| Nav padding      | `10px 20px` (mobile)            |
| Dropdown margin  | `10px 20px`                     |
| Icon tamaño      | `30px × 30px`, `border-radius: 50%` |

---

## 9. Efectos y Animaciones

| Efecto                | Detalle                                          |
|-----------------------|--------------------------------------------------|
| Transiciones generales | `0.3s ease`                                     |
| Scroll animations     | AOS (Animate On Scroll)                          |
| Hover de nav icons    | Fondo cambia a `#C9A84C`, color a blanco         |
| Marquee de aliados    | Animación `scroll` horizontal infinita           |
| Lightbox              | GLightbox para galería de imágenes               |
| Slider                | Swiper.js para carruseles                        |

---

## 10. Resumen Rápido para Diseñadores

```
╔══════════════════════════════════════════════════════════╗
║            WEALTH TRUST PARTNERS — QUICK REF            ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  COLORES                                                 ║
║  ● Dorado Marca ......... #C9A84C                       ║
║  ● Navy Oscuro .......... #0A1628                       ║
║  ● Navy Superficie ...... #152238                       ║
║  ● Gris Texto ........... #2C2C2C                       ║
║  ● Crema Fondo .......... #F8F6F0                       ║
║  ● Blanco ............... #FFFFFF                       ║
║  ● Gris Secundario ...... #a0a5aa                       ║
║                                                          ║
║  TIPOGRAFÍAS                                             ║
║  ● Títulos .............. Raleway (Bold)                 ║
║  ● Navegación / CTAs .... Poppins (Semi-Bold)           ║
║  ● Cuerpo de Texto ...... Roboto (Regular)              ║
║                                                          ║
║  BOTONES CTA                                             ║
║  ● Fondo ................ #C9A84C                       ║
║  ● Texto ................ #FFFFFF                       ║
║  ● Border-radius ........ 5px                           ║
║  ● Font ................. Poppins 600 14px              ║
║                                                          ║
║  FONDOS                                                  ║
║  ● Claro ................ #FFFFFF                       ║
║  ● Alternado ............ #F8F6F0                       ║
║  ● Premium/Dark ......... #0A1628                       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## 11. Variables CSS (Copiar y Pegar)

```css
:root {
  /* Fuentes */
  --default-font: "Roboto", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
  --heading-font: "Raleway", sans-serif;
  --nav-font: "Poppins", sans-serif;

  /* Colores Globales */
  --background-color: #ffffff;
  --default-color: #2C2C2C;
  --heading-color: #0A1628;
  --accent-color: #C9A84C;
  --surface-color: #ffffff;
  --contrast-color: #ffffff;

  /* Colores de Navegación */
  --nav-color: #ffffff;
  --nav-hover-color: #C9A84C;
  --nav-mobile-background-color: #ffffff;
  --nav-dropdown-background-color: #ffffff;
  --nav-dropdown-color: #2C2C2C;
  --nav-dropdown-hover-color: #C9A84C;
}

/* Fondo Alternado */
.light-background {
  --background-color: #F8F6F0;
  --surface-color: #ffffff;
}

/* Fondo Premium / Oscuro */
.dark-background {
  --background-color: #0A1628;
  --default-color: #ffffff;
  --heading-color: #ffffff;
  --surface-color: #152238;
  --contrast-color: #ffffff;
}
```

---

> **📌 Nota:** Este manual fue generado a partir de los archivos fuente del sitio web de Wealth Trust Partners. Cualquier actualización de marca debe reflejarse tanto en este documento como en el archivo `main.css`.
