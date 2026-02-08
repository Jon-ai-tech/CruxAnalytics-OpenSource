# 🚀 CruxAnalytics

**Enterprise-grade financial diagnostic platform for business case analysis.**
Now Open Source and free for everyone.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-orange.svg)](https://expo.dev/)

---

## 📊 Overview

CruxAnalytics is a modular financial engine designed for strategic business analysis. It helps entrepreneurs and financial analysts evaluate project viability through professional-grade metrics, sensitivity analysis, and automated reports.

**Core Features:**
- **Standard Metrics**: ROI, NPV, IRR, and Payback Period.
- **Vanguard Metrics**: Operational Friction (OFI), Tech-Debt Drag (TFDI), and Strategic Efficiency (SER).
- **Guest Mode**: Use all features without creating an account or logging in.
- **Cross-Platform**: Optimized for Web browsers and Mobile (iOS/Android).
- **Professional Reports**: Export Executive Summaries with charts and AI insights.

---

## ⭐ Key Metrics

### **Proprietary Intelligence (Now Free)**
- **OFI (Operational Friction Index)**: Quantifies cost of manual processes as % of revenue.
- **TFDI (Tech-Debt Financial Drag Index)**: Measures financial impact of technical debt.
- **SER (Strategic Efficiency Ratio)**: Evaluates capital efficiency for sustainable growth.

---

## 🏗️ Architecture

Built on **SOLID principles** and **Domain-Driven Design (DDD)**:
- **Domain Layer**: Pure business logic (Calculators, Entities).
- **Application Layer**: Use cases (Scenario comparison, Report generation).
- **Infrastructure**: Persistence (tRPC + Drizzle ORM), PDF Generation, and AI integration.

---

## 🚀 Quick Start

### **Prerequisites**
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 9+

### **Installation**

```bash
# Clone the repository
git clone https://github.com/TU_USUARIO/CruxAnalytics.git
cd CruxAnalytics

# Install dependencies
pnpm install

# Setup local database and environment
pnpm setup
```

### **Run Development server**

```bash
# Start both server and web frontend
pnpm dev
```

---

## 🧪 Testing & Quality

```bash
# Run SME calculator precision tests
pnpm test

# Type checking
pnpm check
```

---

## 📦 Tech Stack

- **Frontend**: React Native with Expo SDK 54 + NativeWind 4.
- **Backend**: Node.js + Express + tRPC.
- **Database**: MySQL with Drizzle ORM.
- **AI Integration**: OpenAI (Optional for narrative insights).

---

## 🗺️ Documentation

- [Architecture Overview](docs/ARCHITECTURE-V2.md)
- [Database Schema](docs/database-migration.md)
- [Vanguard Metrics Methodology](docs/architecture/ADR-003-vanguard-metrics.md)

---

## 🤝 Contributing

We welcome contributions! Feel free to open an issue or submit a pull request to improve the calculators or UI.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Vanguard Crux community.**
*Transforming complexity into competitive advantages.*