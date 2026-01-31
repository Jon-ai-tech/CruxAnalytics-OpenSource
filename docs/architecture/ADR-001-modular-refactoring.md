# ADR-001: Modular Architecture Refactoring

**Status:** Accepted  
**Date:** 2026-01-31  
**Decision Makers:** Vanguard Crux Engineering Team  

## Context

The original CruxAnalytics codebase had all calculation logic in a single `financial-calculator.ts` file. As the application evolved to include:
- Vanguard Crux proprietary metrics (OFI, TFDI, SER)
- SaaS-specific metrics (LTV/CAC, NRR, Rule of 40)
- Risk analysis metrics (Runway, Churn Impact)
- XAI (Explainable AI) context for LLM integration

The monolithic structure became a maintainability bottleneck and didn't align with our brand as a world-class technology partner.

## Decision

We will refactor CruxAnalytics to follow a layered, modular architecture based on **SOLID principles** and **Domain-Driven Design (DDD)**:

### Architecture Layers

1. **Domain Layer** (`lib/domain/`)
   - Pure business logic with no external dependencies
   - Entities: `Metric`, `Project`
   - Value Objects: `Money`, `Percentage`, `DateRange`
   - Repository Interfaces: `IProjectRepository`

2. **Application Layer** (`lib/application/`)
   - Use cases orchestrating business logic
   - Services coordinating multiple operations
   - Strategy interfaces for polymorphic behavior

3. **Infrastructure Layer** (`lib/infrastructure/`)
   - Concrete implementations of calculators
   - Context generation strategies for XAI
   - Data access, validation, encryption, logging

### Design Patterns Applied

- **Repository Pattern**: Abstracts data persistence
- **Strategy Pattern**: Different context generation strategies for metrics
- **Factory Pattern**: Creates metrics with appropriate calculators
- **Template Method Pattern**: Base calculator with common functionality

## Rationale

### Why SOLID Principles?

1. **Single Responsibility**: Each calculator handles one metric category
2. **Open/Closed**: New metrics can be added without modifying existing code
3. **Liskov Substitution**: All calculators extend `BaseCalculator`
4. **Interface Segregation**: Small, focused interfaces (e.g., `IContextStrategy`)
5. **Dependency Inversion**: Depend on abstractions (`IProjectRepository`)

### Why Domain-Driven Design?

- **Ubiquitous Language**: Terms like "OFI", "TFDI", "SER" are domain concepts
- **Bounded Contexts**: Financial, Operational, Strategic, Risk metrics
- **Value Objects**: `Money`, `Percentage` enforce business rules
- **Entities**: `Metric`, `Project` have identity and lifecycle

### Why XAI Layer?

- **Transparency**: Users understand *why* a metric has a certain value
- **LLM Integration**: Structured context enables AI-powered insights
- **Education**: Teaches users about financial metrics
- **Trust**: Vanguard Crux demonstrates technical authority

## Consequences

### Positive

- ✅ **Maintainability**: Each module has clear responsibility
- ✅ **Testability**: Isolated units can be tested independently
- ✅ **Extensibility**: New metrics easily added
- ✅ **Brand Strength**: Code quality demonstrates Vanguard Crux expertise
- ✅ **XAI Ready**: Prepared for AI agent integration
- ✅ **Backward Compatible**: Old code still works

### Negative

- ⚠️ **Complexity**: More files and abstractions
- ⚠️ **Learning Curve**: Team must understand DDD concepts
- ⚠️ **Bundle Size**: Additional code (~15% increase)

### Mitigation

- Comprehensive documentation and examples
- Training materials on DDD and SOLID
- Code splitting and lazy loading for bundle size
- Gradual migration strategy

## Alternatives Considered

### Alternative 1: Keep Monolithic Structure
**Rejected** because it doesn't scale and doesn't align with Vanguard Crux brand.

### Alternative 2: Microservices Architecture
**Rejected** as overkill for a client-side app. Would add network latency and complexity.

### Alternative 3: Class-Based OOP Without DDD
**Rejected** because it lacks the rich domain modeling and ubiquitous language benefits.

## Implementation Notes

- Existing `financial-calculator.ts` updated with deprecation notices
- Wrapper functions maintain backward compatibility
- New code uses modern TypeScript features (strict mode, generics)
- All public APIs have comprehensive JSDoc documentation

## Success Metrics

- ✅ All existing tests pass
- ✅ No breaking changes to public API
- ✅ TypeScript strict mode with zero errors
- ✅ Bundle size increase < 15%
- ✅ Calculation performance < 100ms for standard metrics
- ✅ 100% JSDoc coverage for public APIs

## Related Decisions

- [ADR-002: XAI Layer Design](./ADR-002-xai-layer.md)
- [ADR-003: Vanguard Metrics](./ADR-003-vanguard-metrics.md)

## References

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
