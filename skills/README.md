# AI Agent Instruction Sets (Skills)

This directory contains reusable AI agent instruction sets for analyzing tax system code using the SpecOps methodology.

## What Are Instruction Sets?

Also called "skills," these are detailed guides that teach AI agents how to:
1. **Analyze legacy code** - Understand complex business logic
2. **Extract knowledge** - Identify institutional knowledge embedded in code
3. **Generate specifications** - Produce human-readable documentation
4. **Map to authority** - Link code to authoritative sources (IRS publications, regulations)

## Skills in This Directory

### 1. Tax Logic Comprehension (`tax-logic-comprehension.md`)

**Type:** Foundation/Core Skill  
**Domain:** U.S. Federal Income Tax Systems

The **parent skill** for all tax-related code analysis. Teaches AI agents to:
- Recognize tax concepts in source code (dependents, deductions, credits, etc.)
- Distinguish business logic from technical plumbing
- Map code to IRS publications and IRC sections
- Document edge cases and special rules
- Produce specifications that tax policy experts can verify

**Use this when:** Starting any tax system code analysis

---

### 2. Standard Deduction Calculation (`standard-deduction-calculation.md`)

**Type:** Specialized Skill  
**Domain:** Tax Deductions  
**Parent Skill:** Tax Logic Comprehension

A **specialized skill** focused on standard deduction rules. Teaches AI agents to:
- Extract base standard deduction amounts by filing status
- Identify additional deduction logic (age 65+, blindness)
- Document the complex "birthday rule" (IRS Pub 501)
- Understand reduced deductions for dependents
- Analyze Married Filing Separately special rules
- Handle deceased spouse scenarios

**Use this when:** Analyzing standard deduction code or related test cases

---

### 3. Scala Fact Graph Comprehension (`scala-fact-graph-comprehension.md`)

**Type:** Specialized Skill  
**Domain:** Declarative Knowledge Graphs  
**Parent Skill:** Tax Logic Comprehension

A **specialized skill** for analyzing declarative XML-based Fact Graph systems. Teaches AI agents to:
- Distinguish writable facts (inputs) from derived facts (calculations)
- Translate XML operations to plain language business rules
- Analyze dependency graphs and fact relationships
- Document progressive tax brackets and phase-outs
- Understand bidirectional sync (JVM ↔ JavaScript)
- Extract logic from Switch/Case conditional structures

**Use this when:** Analyzing Scala Fact Graph XML definitions or declarative knowledge graph systems

---

### 4. Dependent Qualification Comprehension (`dependent-qualification-comprehension.md`)

**Type:** Specialized Skill  
**Domain:** Dependent Eligibility Rules  
**Parent Skill:** Tax Logic Comprehension

A **specialized skill** for analyzing dependent qualification logic. Teaches AI agents to:
- Extract the five tests for "qualifying child" status
- Extract the four tests for "qualifying relative" status
- Document age test cascading conditions (under 19, student under 24, disabled any age)
- Analyze tiebreaker rules when multiple taxpayers could claim the same dependent
- Handle joint return test exceptions
- Document support test directionality (QC vs QR)
- Map relationship categories and hierarchies

**Use this when:** Analyzing dependent qualification code, Form 2441 eligibility, or rules affecting CTC/EITC/Head of Household status

---

## How to Use These Skills

### Combining Parent and Specialized Skills

**For comprehensive analysis, use skills in layers:**

1. **Foundation Layer**: Start with `tax-logic-comprehension.md`
   - Provides core tax terminology and concepts
   - Establishes IRC and IRS publication recognition
   - Sets up business logic vs. technical code distinction

2. **Specialization Layer**: Add domain-specific skill(s)
   - `standard-deduction-calculation.md` - For deduction analysis
   - `dependent-qualification-comprehension.md` - For dependent rules
   - `scala-fact-graph-comprehension.md` - For declarative knowledge graphs

**Example prompt structure:**
```
You are analyzing standard deduction calculation code from IRS Direct File.

Apply these skills in order:
1. Tax Logic Comprehension (foundation)
2. Standard Deduction Calculation (specialized)

Analyze the code in /examples/standard-deduction/ and generate 
a specification following the output templates in both skills.
```

### With Claude (Projects/Custom Instructions)

1. Copy the entire skill file content
2. Add to your Claude Project custom instructions, OR
3. Provide as context in your conversation
4. For specialized analysis, include both parent and specialized skills

### With GitHub Copilot

1. Add skill files to `.github/copilot-instructions.md` in your repo
2. Reference by name in prompts: "Using the Tax Logic Comprehension skill..."
3. For specialized tasks: "Using Tax Logic Comprehension and Standard Deduction skills..."

### With Cursor / Other AI IDEs

1. Add skills to project documentation folder
2. Reference in agent prompts or composer instructions

## Skill Structure

Each skill follows this format:

```markdown
# AI Agent Instruction Set: [Skill Name]

**Skill Type:** [Foundation/Specialized]
**Domain:** [Area of expertise]
**Parent Skill:** [If applicable]

## Purpose
[What this skill does]

## Core Principles
[Key concepts and approaches]

## Patterns to Identify
[Code patterns and what they mean]

## Analysis Approach
[Step-by-step process]

## Output Format
[How to structure the output]

## Examples
[Good and bad examples]

## Validation Checklist
[How to verify quality]
```

## Creating New Skills

When developing new tax-related skills:

1. **Start with Tax Logic Comprehension as foundation**
2. **Identify the specific domain** (dependent rules, tax credits, form calculations)
3. **Extract patterns from examples** (see `/examples` directory)
4. **Document authoritative sources** (IRS pubs, IRC sections, forms)
5. **Include edge cases** from test analysis
6. **Provide output templates** for consistent specifications

### Planned Skills (Not Yet Developed)

Based on IRS Direct File analysis, future skills could include:

- **Child Tax Credit Rules** - For CTC eligibility and calculation
- **EITC Eligibility** - For Earned Income Tax Credit logic
- **Filing Status Determination** - For Single/MFJ/MFS/HoH/QSS rules
- **Interview Flow Analysis** - For question branching logic
- **MeF XML Generation** - For tax form XML output patterns

## Skill Maintenance

Skills should be updated when:
- ✅ Tax law changes (annual updates)
- ✅ New edge cases discovered during specification work
- ✅ Feedback from domain experts reveals gaps
- ✅ Code patterns evolve in target systems
- ✅ Better documentation approaches are identified

## Validation

Skills are validated through:
1. **Example Analysis** - Testing against real code samples (see `/examples`)
2. **Specification Generation** - Creating actual specs using the skill
3. **Expert Review** - Domain experts verify output quality
4. **Iteration** - Refining based on practical use

## Portability

These skills are designed to be **portable across organizations**:
- **General patterns** apply to any tax system (state or federal)
- **Authoritative sources** are publicly available (IRS publications)
- **Output formats** are vendor-neutral
- **Reusable** for similar domains (benefits, regulatory compliance)

## SpecOps Phases

These skills support SpecOps methodology phases:

**Phase 1: Discovery and Assessment**
- Use skills to scope modernization effort
- Identify knowledge preservation priorities

**Phase 2: Specification Generation** ← **PRIMARY USE**
- AI agents use skills to analyze code
- Generate initial specifications

**Phase 3: Specification Verification**
- Domain experts review generated specs
- Skills ensure specs are in format experts can verify

**Phase 4-6: Implementation, Testing, Deployment**
- Verified specs guide new implementations
- Skills provide quality criteria

## Contributing

To contribute new skills or improvements:

1. **Follow the established format** (see existing skills)
2. **Include working examples** from real code
3. **Document authoritative sources**
4. **Provide validation checklist**
5. **Test against actual code samples**

## License

MIT - These skills are designed to be freely shared across government agencies and civic tech community.

---

**Questions?** See main project README or SpecOps documentation at https://spec-ops.ai
