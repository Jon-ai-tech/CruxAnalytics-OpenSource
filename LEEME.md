# 🚀 CruxAnalytics (Español)

**Plataforma de diagnóstico financiero de grado empresarial para el análisis de casos de negocio.**
Ahora de código abierto (Open Source) y gratuita para toda la comunidad.

---

## 📊 ¿Qué es CruxAnalytics?

CruxAnalytics es un potente motor financiero diseñado para la evaluación estratégica de proyectos empresariales. A diferencia de las hojas de cálculo tradicionales, Crux ofrece una estructura modular basada en principios de ingeniería de software de clase mundial, permitiendo a emprendedores, analistas y agencias de innovación cuantificar la viabilidad de sus ideas con precisión científica.

El proyecto nació bajo la premisa de **"Claridad en la Complejidad"**, transformando datos financieros brutos en insights accionables mediante métricas estándar de la industria y metodologías propietarias ahora liberadas.

---

## 🎯 ¿Para qué fue creado?

Este proyecto fue desarrollado para resolver tres problemas críticos en el análisis de negocios:

1.  **Falta de Estándares**: Automatizar el cálculo de métricas complejas (como la TIR mediante algoritmos iterativos) para evitar errores humanos.
2.  **Invisibilidad de la Eficiencia**: Introducir las **Métricas Vanguard** (OFI, TFDI, SER) para medir problemas que los balances contables tradicionales suelen ignorar, como el costo de los procesos manuales o el lastre financiero de la deuda técnica.
3.  **Análisis Predictivo Local**: Crear una herramienta que permita realizar simulaciones de escenarios (Mejor/Peor caso) de forma privada, sin que los datos sensibles abandonen la infraestructura del usuario.

---

## 🛠️ ¿Cómo funciona?

### Arquitectura Modular (DDD)
CruxAnalytics utiliza una arquitectura basada en **Domain-Driven Design (DDD)**, lo que separa claramente la "inteligencia del negocio" de la "tecnología":

*   **Capa de Dominio**: Contiene los cálculos puros (ROI, NPV, TIR). Es el corazón del sistema y no depende de ninguna base de datos o interfaz.
*   **Capa de Aplicación**: Gestiona los casos de uso, como comparar dos escenarios diferentes o generar un diagnóstico narrativo.
*   **Capa de Infraestructura**: Maneja la persistencia (MySQL con Drizzle ORM), la comunicación (tRPC) y la generación de reportes PDF.

### Modo Invitado (Frictionless)
Para maximizar la utilidad, la aplicación implementa un **"Modo Invitado"** automático. Esto permite a cualquier usuario empezar a crear y guardar proyectos inmediatamente sin necesidad de registrarse, utilizando un ID de usuario por defecto en el backend.

---

## 📊 Métricas Incluidas

### 1. Financieras Estándar
*   **ROI (Retorno de Inversión)**: Rentabilidad porcentual del capital.
*   **NPV (Valor Presente Neto)**: Valor de los flujos futuros descontados al presente.
*   **IRR (TIR - Tasa Interna de Retorno)**: Rentabilidad intrínseca calculada con precisión mediante el algoritmo Newton-Raphson.
*   **Payback (Periodo de Recuperación)**: Tiempo exacto en meses para recuperar la inversión.

### 2. Métricas Vanguard (Proprietarias)
*   **OFI (Operational Friction Index)**: Cuantifica cuánto dinero pierde la empresa por tener procesos manuales en lugar de automatizados.
*   **TFDI (Tech-Debt Drag)**: Mide el impacto económico directo de mantener sistemas antiguos o código mal escrito.
*   **SER (Strategic Efficiency Ratio)**: Evalúa si el crecimiento de la empresa es sostenible en relación al aumento de sus gastos (Burn Rate).

---

## 📦 Tecnologías Utilizadas

CruxAnalytics usa un stack moderno y profesional:

*   **Frontend**: React Native con **Expo SDK 54**. Permite que la app funcione en iPhone, Android y Navegadores Web con el mismo código.
*   **Estilo**: **NativeWind 4** (Tailwind CSS para móvil), permitiendo un diseño "premium" y adaptable.
*   **Backend**: Node.js con **tRPC**, garantizando seguridad de tipos (Typescript) del servidor al cliente.
*   **Base de Datos**: **MySQL** administrado por **Drizzle ORM** para consultas ultra-rápidas y seguras.
*   **IA**: Integración opcional con **OpenAI** para generar diagnósticos narrativos que explican los números en lenguaje humano.

---

## 🚀 Guía de Inicio Rápido

### Requisitos
*   Node.js 18 o superior.
*   pnpm (recomendado) o npm.

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/CruxAnalytics.git
cd CruxAnalytics

# 2. Instalar dependencias
pnpm install

# 3. Configurar entorno y base de datos local
pnpm setup
```

### Ejecución

```bash
# Iniciar el servidor y la interfaz web simultáneamente
pnpm dev
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Eres libre de usarlo, modificarlo y distribuirlo, incluso para fines comerciales.

---

**Desarrollado con excelencia por la comunidad de Vanguard Crux.**
*Transformando la complejidad en ventajas competitivas.*
