# 🚀 CruxAnalytics

**Enterprise-grade business case analysis platform with proprietary Vanguard Crux metrics and XAI integration.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

---

## 📊 Overview

CruxAnalytics is a modular financial diagnostic platform designed for strategic business analysis. Built with **privacy-first architecture** and **SOLID principles**.

**15 unique metrics across 4 categories:**
- Standard Financial (ROI, NPV, IRR, Payback)
- Vanguard Crux Proprietary (OFI, TFDI, SER)
- SaaS Metrics (LTV/CAC, NRR, Rule of 40)
- Risk Metrics (Runway, Churn Impact)

---

## ⭐ Vanguard Crux Proprietary Metrics

### **OFI (Operational Friction Index)**
Quantifies cost of manual processes as % of revenue.
- **Formula:** `(Manual Hours × Cost × 52) / Annual Revenue`
- **Benchmark:** <3% optimal, >10% critical
- **Use Case:** Identifies automation ROI opportunities

### **TFDI (Tech-Debt Financial Drag Index)**
Measures financial impact of technical debt and legacy systems.
- **Formula:** `(Maintenance Ratio × Team Cost) + Annual Incidents`
- **Benchmark:** <15% optimal, >30% critical
- **Use Case:** Justifies refactoring investments with ROI

### **SER (Strategic Efficiency Ratio)**
Evaluates resource-to-outcome conversion efficiency.
- **Formula:** `Revenue Growth Rate / Burn Rate Increase`
- **Benchmark:** >1.5 excellent, <0.8 concerning
- **Use Case:** Measures capital efficiency and sustainability

---

## 🏗️ Architecture

Domain-Driven Design with clean modular layers:

```
lib/
├── domain/              # Pure business entities (Metric, Project)
├── application/         # Use cases & services orchestration
│   ├── use-cases/      # CalculateFinancialMetrics, GenerateDiagnosticReport
│   ├── services/       # XAI, Calculation, Validation services
│   └── factories/      # MetricFactory (Strategy pattern)
├── infrastructure/      # Technical implementations
│   ├── calculators/    # Standard, Vanguard, SaaS, Risk calculators
│   ├── strategies/     # XAI context generation (ROI, NPV, OFI, etc.)
│   └── persistence/    # Repository implementations
└── xai/                # Explainable AI layer
```

**Design Patterns Used:**
- Repository Pattern
- Strategy Pattern
- Factory Pattern
- Dependency Injection
- Template Method

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- pnpm 8+

### **Installation**

```bash
# Clone repository
git clone https://github.com/suscripcionesue5-cyber/CruxAnalytics.git
cd CruxAnalytics

# Install dependencies
pnpm install

# Run tests
pnpm test

# Start development server
pnpm dev
```

### **Environment Variables**

Create a `.env` file (see `.env.example`):

```bash
# Optional: OpenAI integration for AI insights
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini

# Mock payments for development
EXPO_PUBLIC_USE_MOCK_PAYMENTS=true
```

> **Note:** Tests automatically skip OpenAI integration tests if `OPENAI_API_KEY` is not set.

---

## 💻 Usage Example

### **Calculate Vanguard Metrics**

```typescript
import { CalculateFinancialMetrics } from '@/lib/application/use-cases/CalculateFinancialMetrics';

const useCase = new CalculateFinancialMetrics();

const projectData = {
  name: 'Digital Transformation Initiative',
  initialInvestment: 500000,
  discountRate: 10,
  projectDuration: 24,
  yearlyRevenue: 2000000,
  revenueGrowth: 15,
  operatingCosts: 400000,
  maintenanceCosts: 50000,
  
  // Vanguard Crux proprietary metrics input
  vanguardInput: {
    // OFI inputs
    manualProcessHoursPerWeek: 40,
    averageHourlyCost: 75,
    automationPotential: 70,
    
    // TFDI inputs
    maintenanceHoursPerSprint: 60,
    totalDevHoursPerSprint: 160,
    devTeamAnnualCost: 800000,
    incidentCostPerMonth: 10000,
    
    // SER inputs
    currentRevenue: 2000000,
    previousRevenue: 1500000,
    currentBurnRate: 150000,
    previousBurnRate: 120000,
  }
};

const results = await useCase.execute(projectData);

// Access standard metrics
console.log('ROI:', results.standard.find(m => m.name === 'ROI')?.value);
console.log('NPV:', results.standard.find(m => m.name === 'NPV')?.value);

// Access Vanguard proprietary metrics with XAI context
results.vanguard.forEach(metric => {
  console.log(`\n${metric.name}: ${metric.value}`);
  console.log(`Category: ${metric.context.category}`);
  console.log(`Interpretation: ${metric.context.interpretation}`);
  console.log('Recommendations:');
  metric.context.recommendations?.forEach(rec => console.log(`  - ${rec}`));
});
```

### **Example Output**

```javascript
{
  name: "OFI",
  value: 0.078,
  context: {
    category: "operational",
    formula: "(Manual Hours × Cost × 52) / Revenue",
    interpretation: "acceptable",
    benchmarks: {
      optimal: 0.03,
      acceptable: 0.08,
      industry: 0.10
    },
    recommendations: [
      "Operational friction within acceptable range",
      "Potential annual savings: $156,000 with 70% automation",
      "Consider automating high-volume repetitive tasks first"
    ]
  }
}
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test tests/architecture.test.ts

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### **Test Environment**

Tests are configured to be resilient:
- ✅ Skip OpenAI tests gracefully if API key is missing
- ✅ Use mock payment services by default (no RevenueCat required)
- ✅ Set default environment variables automatically
- ✅ Run without external configuration

---

## 📦 Tech Stack

### **Core**
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript 5.9 (strict mode)
- **Navigation:** Expo Router 6
- **Styling:** NativeWind 4 (Tailwind CSS for React Native)

### **Backend**
- **Server:** Express + tRPC
- **Database:** MySQL with Drizzle ORM
- **AI Integration:** OpenAI SDK

### **Testing & Quality**
- **Testing:** Vitest
- **Linting:** ESLint 9
- **Type Safety:** TypeScript strict mode

### **Features**
- **Charts:** react-native-chart-kit
- **PDF Generation:** expo-file-system + expo-sharing
- **State Management:** React Context + Zustand
- **Internationalization:** Custom i18n context (ES/EN)

---

## 📚 Documentation

### **Architecture & Design**
- [Architecture Overview V2](docs/ARCHITECTURE-V2.md)
- [Implementation Summary](docs/IMPLEMENTATION-SUMMARY.md)
- [API Documentation](DOCUMENTATION.md)

### **Architecture Decision Records (ADRs)**
- [ADR-001: Modular Refactoring](docs/architecture/ADR-001-modular-refactoring.md)
- [ADR-002: XAI Layer Design](docs/architecture/ADR-002-xai-layer.md)
- [ADR-003: Vanguard Metrics Methodology](docs/architecture/ADR-003-vanguard-metrics.md)

### **Examples**
- [Calculate Financial Metrics Example](lib/examples/calculate-financial-metrics-example.ts)

---

## 🎯 Key Features

### **Standard Financial Analysis**
- **ROI** (Return on Investment) with percentage calculation
- **NPV** (Net Present Value) with discounted cash flows
- **IRR** (Internal Rate of Return) using Newton-Raphson algorithm
- **Payback Period** with linear interpolation for precision

### **Vanguard Crux Proprietary Intelligence**
- **OFI** - Quantifies operational inefficiencies
- **TFDI** - Measures tech debt financial impact
- **SER** - Evaluates strategic capital efficiency

### **SaaS Business Metrics**
- **LTV/CAC** ratio with payback period analysis
- **NRR** (Net Revenue Retention) for growth measurement
- **Rule of 40** for scale-up health assessment

### **Risk Assessment**
- **Runway** calculation (zero cash date projection)
- **Probabilistic churn impact** over 6-month horizon

### **XAI (Explainable AI) Integration**
Every metric includes structured context:
- Formula and calculation method
- Business assumptions and constraints
- Interpretation (positive/negative/neutral)
- Industry benchmarks
- Actionable recommendations

---

## 🔒 Privacy & Security

- **Privacy-First Design** - All calculations run locally
- **No External Data Sharing** - Financial data never leaves your infrastructure
- **Optional AI Integration** - OpenAI integration is opt-in
- **Encryption Ready** - Schema prepared for data-at-rest encryption

---

## 🌍 Internationalization

Full support for:
- 🇪🇸 Spanish (Español)
- 🇺🇸 English

All UI, metrics, and recommendations are fully translated.

---

## 🤝 Contributing

This is a proprietary project by **Vanguard Crux**. 

For collaboration or licensing inquiries, contact the team.

---

## 📄 License

© 2026 Vanguard Crux. All rights reserved.

This is proprietary software. Unauthorized copying, modification, or distribution is prohibited.

---

## 🌟 About Vanguard Crux

**Vanguard Crux** is an elite technology innovation agency specializing in transforming complexity into competitive advantages.

### **Our Philosophy**

- **Anticipation** - Code prepared for the future, not just today's requirements
- **Technical Transparency** - No black boxes; clients understand what we build
- **High-Performance Efficiency** - Robust solutions that optimize financial outcomes

### **Our Approach**

CruxAnalytics is our open-source strategic diagnostic platform, demonstrating:
- World-class software architecture
- Proprietary business intelligence methodologies
- Enterprise-grade code quality
- Technical authority in financial analytics

We don't just build software. We engineer competitive advantages.

---

## 📞 Contact & Support

**Vanguard Crux**  
Elite Technology Innovation Agency

- GitHub: [@suscripcionesue5-cyber](https://github.com/suscripcionesue5-cyber)
- Website: [Coming Soon]

---

**Built with ❤️ and ☕ by the Vanguard Crux team**

*Transforming complexity into competitive advantages since 2026*