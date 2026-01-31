# CruxAnalytics v2.0 - Modular Architecture

## 🎯 Overview

CruxAnalytics v2.0 represents a complete architectural transformation into a world-class modular diagnostic platform. Built on **SOLID principles** and **Domain-Driven Design**, it provides comprehensive business intelligence with an **XAI (Explainable AI) layer** for LLM integration.

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│           UI Layer (React Native)           │
│  Components, Forms, Dashboards, Charts      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Application Layer (Use Cases)        │
│  CalculateFinancialMetrics                  │
│  GenerateDiagnosticReport                   │
│  CompareScenarios                           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│       Application Services & Factories       │
│  CalculationService, XAIService             │
│  ValidationService, MetricFactory           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Infrastructure Layer (Calculators)      │
│  StandardMetricsCalculator                  │
│  VanguardMetricsCalculator ⭐               │
│  SaaSMetricsCalculator                      │
│  RiskMetricsCalculator                      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Domain Layer (Pure Business Logic)   │
│  Entities: Metric, Project                  │
│  Value Objects: Money, Percentage, DateRange│
│  Repositories: IProjectRepository           │
└─────────────────────────────────────────────┘
```

## 📊 Metrics Categories

### 1. Standard Financial Metrics
- **ROI** (Return on Investment)
- **NPV** (Net Present Value)
- **IRR** (Internal Rate of Return)
- **Payback Period**

### 2. Vanguard Crux Proprietary Metrics ⭐

#### OFI (Operational Friction Index)
Quantifies the financial burden of manual operational processes.
- **Formula**: `(Manual Hours × Cost × 52) / Annual Revenue`
- **Optimal**: < 0.03 | **Industry**: 0.10
- **Value**: Identifies automation ROI opportunities

#### TFDI (Tech-Debt Financial Drag Index)
Measures the financial impact of technical debt and legacy systems.
- **Formula**: `(Maintenance Ratio × Team Cost) + (Incidents × 12)`
- **Optimal**: < 0.15 | **Industry**: 0.30
- **Value**: Justifies refactoring investments

#### SER (Strategic Efficiency Ratio)
Assesses capital efficiency for sustainable growth.
- **Formula**: `Revenue Growth Rate / Burn Rate Increase`
- **Optimal**: > 2.0 | **Industry**: 1.2
- **Value**: Single metric for growth sustainability

### 3. SaaS Metrics
- **LTV** (Lifetime Value)
- **LTV/CAC Ratio**
- **CAC Payback Period**
- **NRR** (Net Revenue Retention)
- **Rule of 40**

### 4. Risk Metrics
- **Runway** (months until zero cash)
- **Zero Cash Date**
- **Churn Impact** (6-month probabilistic)

## 🤖 XAI (Explainable AI) Layer

Every metric is enriched with comprehensive context:

```typescript
interface MetricContext {
  category: 'financial' | 'operational' | 'strategic' | 'risk';
  formula: string;                    // Human-readable formula
  assumptions: string[];              // What we assumed
  constraints: string[];              // Limitations
  interpretation: 'positive' | 'negative' | 'neutral';
  benchmarks?: {
    industry: number;
    optimal: number;
    acceptable: number;
  };
  recommendations?: string[];         // Actionable advice
}
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { CalculateFinancialMetrics } from '@/lib/application/use-cases/CalculateFinancialMetrics';
import type { ProjectData } from '@/types/project';

// Prepare project data
const projectData: ProjectData = {
  id: 'project-001',
  name: 'New Product Launch',
  initialInvestment: 100000,
  discountRate: 10,
  projectDuration: 36,
  yearlyRevenue: 150000,
  revenueGrowth: 20,
  operatingCosts: 30000,
  maintenanceCosts: 10000,
  // ... other fields
};

// Calculate metrics with XAI enrichment
const useCase = new CalculateFinancialMetrics();
const enrichedResults = await useCase.execute(projectData);

// Access standard metrics
enrichedResults.standard.forEach(metric => {
  console.log(`${metric.name}: ${metric.value}`);
  console.log(`Recommendations:`, metric.context.recommendations);
});

// Access Vanguard proprietary metrics
enrichedResults.vanguard.forEach(metric => {
  console.log(`${metric.name}: ${metric.value}`);
});
```

### With Vanguard Metrics

```typescript
const projectData: ProjectData = {
  // ... standard fields ...
  businessModel: 'saas',
  
  vanguardInput: {
    // OFI inputs
    manualProcessHoursPerWeek: 20,
    averageHourlyCost: 50,
    automationPotential: 80,
    
    // TFDI inputs
    maintenanceHoursPerSprint: 40,
    totalDevHoursPerSprint: 160,
    devTeamAnnualCost: 500000,
    incidentCostPerMonth: 5000,
    
    // SER inputs
    currentRevenue: 150000,
    previousRevenue: 125000,
    currentBurnRate: 100000,
    previousBurnRate: 90000,
  },
};
```

## 📦 Directory Structure

```
lib/
├── domain/                          # Pure business logic
│   ├── entities/
│   │   ├── Metric.ts               # Core metric entity with XAI
│   │   └── Project.ts              # Domain entity with validation
│   ├── value-objects/
│   │   ├── Money.ts                # Immutable monetary values
│   │   ├── Percentage.ts           # Percentage value object
│   │   └── DateRange.ts            # Date range with validation
│   └── repositories/
│       └── IProjectRepository.ts   # Repository interface
│
├── application/                     # Use cases & orchestration
│   ├── use-cases/
│   │   ├── CalculateFinancialMetrics.ts  # Main use case
│   │   ├── GenerateDiagnosticReport.ts
│   │   └── CompareScenarios.ts
│   ├── services/
│   │   ├── CalculationService.ts   # Orchestrates calculators
│   │   ├── XAIService.ts           # Generates XAI context
│   │   └── ValidationService.ts    # Input validation
│   ├── factories/
│   │   └── MetricFactory.ts        # Factory pattern
│   └── strategies/
│       └── IContextStrategy.ts     # Strategy interface
│
├── infrastructure/                  # Technical implementations
│   ├── calculators/
│   │   ├── BaseCalculator.ts       # Abstract base class
│   │   ├── StandardMetricsCalculator.ts
│   │   ├── VanguardMetricsCalculator.ts  # ⭐ Proprietary
│   │   ├── SaaSMetricsCalculator.ts
│   │   └── RiskMetricsCalculator.ts
│   ├── strategies/
│   │   ├── ROIContextStrategy.ts
│   │   ├── NPVContextStrategy.ts
│   │   ├── OFIContextStrategy.ts   # ⭐ Proprietary
│   │   ├── TFDIContextStrategy.ts  # ⭐ Proprietary
│   │   ├── SERContextStrategy.ts   # ⭐ Proprietary
│   │   └── DefaultContextStrategy.ts
│   ├── validators/
│   ├── persistence/
│   └── logging/
│
└── examples/
    └── calculate-financial-metrics-example.ts
```

## 🎨 Design Patterns Used

- **Repository Pattern**: Abstracts data persistence
- **Strategy Pattern**: Polymorphic context generation
- **Factory Pattern**: Creates metrics with appropriate calculators
- **Template Method Pattern**: BaseCalculator with common functionality
- **Dependency Injection**: Services depend on interfaces

## 📚 Documentation

- [ADR-001: Modular Architecture Refactoring](./docs/architecture/ADR-001-modular-refactoring.md)
- [ADR-002: XAI Layer Design](./docs/architecture/ADR-002-xai-layer.md)
- [ADR-003: Vanguard Crux Proprietary Metrics](./docs/architecture/ADR-003-vanguard-metrics.md)

## 🔄 Migration from v1.x

Old code continues to work:

```typescript
// v1.x (still works)
import { calculateFinancialMetrics } from '@/lib/financial-calculator';
const results = calculateFinancialMetrics(input);

// v2.0 (recommended)
import { CalculationService } from '@/lib/application/services/CalculationService';
const service = new CalculationService();
const results = await service.calculateStandard(input);

// v2.0 with XAI (best)
import { CalculateFinancialMetrics } from '@/lib/application/use-cases/CalculateFinancialMetrics';
const useCase = new CalculateFinancialMetrics();
const enrichedResults = await useCase.execute(projectData);
```

## ✅ Quality Standards

- **TypeScript Strict Mode**: Enabled
- **SOLID Principles**: Applied throughout
- **100% JSDoc Coverage**: All public APIs documented
- **Domain-Driven Design**: Rich domain model
- **Backward Compatible**: Zero breaking changes
- **Performance**: < 100ms for standard metrics

## 🎯 Success Metrics

- ✅ All existing tests pass
- ✅ TypeScript strict mode with zero errors
- ✅ Bundle size increase < 15%
- ✅ Calculation performance validated
- ✅ Portfolio-quality code

## 🚀 Future Enhancements

### Phase 2: LLM Integration
- Feed XAI context to GPT-4 for natural language explanations
- Generate personalized recommendations
- Compare projects with narrative insights

### Phase 3: Advanced Analytics
- Machine learning for benchmark refinement
- Predictive modeling
- Anomaly detection

### Phase 4: API & Integrations
- REST API for enterprise customers
- Webhooks for real-time updates
- Integration with accounting systems

## 📄 License

Proprietary - Vanguard Crux © 2026

**Vanguard Crux Proprietary Metrics (OFI, TFDI, SER)** are intellectual property of Vanguard Crux and may not be used without authorization.

---

**Built with excellence by the Vanguard Crux Engineering Team** 🚀
