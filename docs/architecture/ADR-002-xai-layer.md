# ADR-002: XAI (Explainable AI) Layer Design

**Status:** Accepted  
**Date:** 2026-01-31  
**Decision Makers:** Vanguard Crux Engineering Team  

## Context

Financial metrics like ROI, NPV, and our proprietary Vanguard metrics (OFI, TFDI, SER) are often **black boxes** to users. They see a number but don't understand:
- What it means
- How it was calculated
- What assumptions were made
- What actions they should take

Additionally, we're preparing for future LLM integration where an AI agent can:
- Interpret metrics in natural language
- Provide personalized recommendations
- Compare scenarios
- Answer "why" questions

## Decision

We will implement a **structured XAI (Explainable AI) layer** that enriches every metric with comprehensive context.

### XAI Context Structure

```typescript
interface MetricContext {
  category: 'financial' | 'operational' | 'strategic' | 'risk';
  formula: string;                    // Human-readable formula
  assumptions: string[];              // What we assumed
  constraints: string[];              // Limitations of the metric
  interpretation: 'positive' | 'negative' | 'neutral';
  benchmarks?: {                      // Industry comparisons
    industry: number;
    optimal: number;
    acceptable: number;
  };
  recommendations?: string[];         // Actionable advice
}
```

### Architecture Components

1. **XAIService**: Orchestrates context generation
2. **IContextStrategy Interface**: Contract for strategy implementations
3. **Context Strategies**: One per metric type (ROI, NPV, OFI, TFDI, SER, etc.)
4. **Metric Entity**: Domain entity that carries both value and context

### Strategy Pattern Implementation

Each metric has a dedicated strategy that knows how to generate rich context:

```typescript
class OFIContextStrategy implements IContextStrategy {
  generateContext(value: number, projectData: any): MetricContext {
    // Generate OFI-specific context with benchmarks,
    // automation recommendations, ROI calculations
  }
}
```

## Rationale

### Why Structured Context?

1. **LLM Consumption**: JSON structure is easier for AI to parse than free text
2. **Consistency**: Same structure across all metrics
3. **Localization**: Each field can be translated independently
4. **Versioning**: Easy to extend with new fields

### Why Strategy Pattern?

- Each metric has unique interpretation logic
- New metrics can be added without modifying core service
- Strategies can be swapped or A/B tested
- Clear separation of concerns

### Why Include Recommendations?

- **Actionable**: Users don't just see numbers, they know what to do
- **Educational**: Builds financial literacy
- **Trust**: Demonstrates Vanguard Crux expertise
- **Vanguard Brand**: Recommendations subtly promote our services

## Consequences

### Positive

- ✅ **Transparency**: Users understand the "why" behind metrics
- ✅ **LLM Ready**: Prepared for AI agent integration
- ✅ **Education**: Users learn financial concepts
- ✅ **Differentiation**: Unique competitive advantage
- ✅ **Trust**: Builds confidence in calculations
- ✅ **Marketing**: Code demonstrates technical authority

### Negative

- ⚠️ **Complexity**: More code to maintain
- ⚠️ **Localization Burden**: All text must be translatable
- ⚠️ **Storage**: XAI data increases payload size

### Mitigation

- Document strategy creation process
- Extract text to localization files
- Implement lazy loading for XAI context
- Cache results for repeated calculations

## Implementation Details

### Context Generation Flow

```
User Input → Calculator → Raw Metric Value
           ↓
     XAIService.enrichMetric()
           ↓
     Strategy.generateContext() → MetricContext
           ↓
     Metric Entity (value + context)
           ↓
     EnrichedProjectResults (JSON)
           ↓
     UI Display | LLM Prompt | PDF Report
```

### Fallback Strategy

If no specific strategy exists for a metric:
- `DefaultContextStrategy` provides basic context
- Still better than no context
- Can be refined later

### Example Output

```json
{
  "name": "OFI",
  "value": 0.12,
  "context": {
    "category": "operational",
    "formula": "(Manual Process Hours × Cost × 52) / Annual Revenue",
    "interpretation": "negative",
    "benchmarks": {
      "optimal": 0.03,
      "acceptable": 0.08,
      "industry": 0.10
    },
    "recommendations": [
      "🚨 High operational friction - Automation strongly recommended",
      "Potential annual savings: $52,000",
      "Vanguard Crux can help identify quick-win automation opportunities"
    ]
  }
}
```

## Future Enhancements

### Phase 2: LLM Integration
- Feed XAI context to GPT-4 for natural language explanations
- Generate personalized recommendations based on user's industry
- Compare multiple projects with narrative insights

### Phase 3: Interactive XAI
- Users can click "Why?" to see detailed explanation
- Visual representation of formulas
- Simulation: "What if I change X?"

### Phase 4: Machine Learning
- Learn which recommendations users find most helpful
- Personalize context based on user behavior
- Predict which metrics users care about most

## Alternatives Considered

### Alternative 1: Free-Text Explanations
**Rejected** because:
- Hard for LLM to parse
- Difficult to localize
- No structure for programmatic use

### Alternative 2: No Explanations (Just Numbers)
**Rejected** because:
- Doesn't align with Vanguard Crux's educational mission
- Users don't learn
- Misses LLM integration opportunity

### Alternative 3: Tooltips in UI Only
**Rejected** because:
- Not portable (can't use in PDF, API, LLM)
- Tight coupling to UI layer
- Doesn't support domain-driven design

## Success Metrics

- ✅ Every metric has XAI context
- ✅ Context generation < 10ms per metric
- ✅ LLM can successfully parse context (validated with GPT-4)
- ✅ User survey: "Explanations are helpful" > 80% agreement
- ✅ Documentation includes XAI examples

## Related Decisions

- [ADR-001: Modular Architecture Refactoring](./ADR-001-modular-refactoring.md)
- [ADR-003: Vanguard Metrics](./ADR-003-vanguard-metrics.md)

## References

- [Explainable AI](https://en.wikipedia.org/wiki/Explainable_artificial_intelligence)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [LangChain Structured Output](https://python.langchain.com/docs/modules/model_io/output_parsers/structured)
