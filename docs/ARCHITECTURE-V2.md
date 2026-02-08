# CruxAnalytics Architecture

## 🎯 Overview

CruxAnalytics is a world-class modular diagnostic platform. Built on **SOLID principles** and **Domain-Driven Design**, it provides comprehensive business intelligence with an **XAI (Explainable AI) layer** for project evaluations.

## 🏗️ Core Layers

### UI Layer (React Native / Web)
- Built with **NativeWind 4** for cross-platform styling.
- Interactive charts using **react-native-chart-kit**.
- Optimized web experience with direct downloads.

### Application Layer (Use Cases)
- **CalculateFinancialMetrics**: The heart of the platform.
- **GenerateDiagnosticReport**: HTML-to-PDF engine for executive summaries.
- **GuestModeService**: Manages frictionless data persistence.

### Infrastructure Layer (Calculators)
- **StandardMetricsCalculator**: High-precision NPV/ROI/IRR.
- **VanguardMetricsCalculator**: Specialized operational efficiency metrics.
- **ReportEngine**: Cross-platform file handling for Web and Mobile.

## 📊 Metrics Methodology

### 1. Standard Financial Metrics
Calculated with geometric compounding for accurate multi-year projections.

### 2. Vanguard Metrics
- **OFI (Operational Friction)**: `(Manual Hours × Cost × 52) / Annual Revenue`.
- **TFDI (Tech-Debt Drag)**: `(Maintenance Ratio × Team Cost) + (Incidents × 12)`.
- **SER (Strategic Efficiency)**: `Revenue Growth Rate / Burn Rate Increase`.

## 🤖 XAI Integration

The platform provides structured context for every calculated metric, including:
- Human-readable formulas.
- Business assumptions and constraints.
- Balanced interpretation and benchmarks.
- Actionable recommendations.

## 📄 License

Open Source under **MIT License**.
Vanguard Metrics methodologies are shared with the community to advance financial transparency.
