### **Status:** Selected

### **Date:** 21.05.2025

### **Author:** Pohorilets Vladyslav

## **Context**:

We need to choose an architectural style that:

- will ensure that the project achieves the desired business goals
- defines the overall structure of the system and the relationships between its components;
- establish a framework for making future technical decisions;
- provide: maintainability, scalability, testability, and isolation of business logic;
- provide flexibility in changing the infrastructure without changing the system core;
- facilitate the long-term development of the project in the face of changing requirements.

## Reviewed options:

1. Layered Architecture
   Pros:

    - Simple structure
    - Widely known and supported
    - Clear separation of concerns (in theory)

    Cons:

    - Tends to violate dependency direction
    - Difficult to isolate business logic
    - Harder to test in isolation

2. Micro-kernel Architecture
   Pros:

    - Supports modularity via plugins
    - Easy to add features without changing core
    - Suitable for extensible systems

    Cons:

    - Not ideal for business-centric logic
    - Complexity in managing plugins
    - Limited applicability for current scope

3. Event-Driven Architecture
   Pros:

    - High scalability
    - Asynchronous communication
    - Decoupled components

    Cons:

    - Difficult to trace logic flow
    - High infrastructure complexity
    - Overhead for simple use cases

4. Clean Architecture
   Pros:

    - Strict separation of concerns
    - High testability
    - Technology-agnostic core
    - Long-term maintainability

    Cons:

    - Increased initial complexity
    - Requires strong architectural discipline
    - Higher onboarding cost for developers

## Decision taken:

Chosen to implement Clean Architecture as defined by Robert C. Martin (Uncle Bob)

## Arguments

- The project is planned as a multi-component system with a mobile application, API, analytics, notifications, and integration with other services
- Long-term support and constant scaling of the logic are expected
- So the most suitable for these requirements is Clean Architecture

## Consequences:

Positive

- Core business logic remains independent of frameworks, UI, and infrastructure
- Facilitates unit testing and test automation
- Enables parallel development of infrastructure and business logic
- Improves maintainability over time
- Eases integration with new external systems or services
- Provides a clear and consistent architectural model for long-term evolution

Negative

- Higher initial complexity and setup cost
- Slower onboarding for new developers unfamiliar with the pattern
- Requires strict adherence to architectural boundaries
- Potential over-engineering if project complexity remains low
