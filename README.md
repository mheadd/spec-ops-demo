# SpecOps Demo: IRS Direct File

A demonstration of the [SpecOps methodology](https://spec-ops.ai) applied to the [IRS Direct File](https://github.com/IRS-Public/direct-file) project, showing how AI agent instruction sets can be used to extract and document institutional knowledge from government tax systems.

## About This Demo

This repository demonstrates how to create reusable AI agent instruction sets (skills) for analyzing tax system code and generating human-verifiable specifications. Rather than directly transpiling code, SpecOps focuses on preserving institutional knowledge in specifications that domain experts can review.

### Why IRS Direct File?

The IRS Direct File project is an excellent demonstration case because:
- **Complex business logic**: Interprets the Internal Revenue Code (26 USC) 
- **Domain expert verification**: Tax policy experts can verify specifications
- **Multi-technology stack**: TypeScript, Scala, Java, JavaScript
- **Public visibility**: Well-known government project (4.5k+ GitHub stars)
- **Institutional knowledge**: Tax calculation rules that need preservation

## Repository Structure

```
spec-ops-demo/
├── skills/                           # AI agent instruction sets
│   ├── tax-logic-comprehension.md    # Understanding tax code patterns
│   ├── scala-fact-graph.md           # Analyzing Fact Graph logic
│   └── standard-deduction.md         # Specific calculation skill
│
├── examples/                         # Code samples from Direct File
│   ├── standard-deduction/           # Standard deduction logic
│   ├── dependent-qualification/      # Dependent rules
│   └── fact-graph-sample/            # Knowledge graph examples
│
├── specifications/                   # Generated specifications
│   └── (AI-generated specs using the skills)
│
└── README.md                         # This file
```

## How to Use This Demo

### 1. Understand the Skills

Review the instruction sets in `skills/` to see how AI agents are guided to:
- Analyze tax system code
- Extract business logic
- Generate plain-language specifications
- Document institutional knowledge

### 2. Examine the Examples

Look at the code samples in `examples/` - these are real excerpts from IRS Direct File showing:
- Tax calculation logic
- Fact Graph reasoning patterns
- Interview flow implementations

### 3. Review Generated Specifications

See the `specifications/` directory for examples of specifications generated using the skills, showing how complex tax logic is translated into human-readable documentation.

## The SpecOps Process

This demo illustrates key SpecOps phases:

**Phase 1: Discovery** - Identify target system components (e.g., standard deduction logic)

**Phase 2: Specification Generation** - Use AI with custom instruction sets to analyze code and generate initial specifications

**Phase 3: Verification** - Domain experts (tax policy professionals) review and validate specifications

**Phase 4: Implementation** - Use verified specifications to guide modern implementations

## Key Principles Demonstrated

1. **The Specification is the Source of Truth** - Specifications capture what the system does, independent of implementation
2. **Domain Experts Are the Arbiters** - Tax experts verify specs, not code
3. **AI Assists, Humans Verify** - AI analyzes code; humans validate accuracy
4. **Reusable Skills** - Instruction sets work across different tax systems

## Skills Being Developed

- **Tax Logic Comprehension**: Understanding IRC references, tax calculations, and form dependencies
- **Standard Deduction Calculation**: Documenting standard vs. itemized deduction logic
- **Scala Fact Graph Analysis**: Analyzing declarative knowledge graph structures and XML-based business rules
- **Dependent Qualification Rules**: Capturing the five tests for qualifying child and four tests for qualifying relative

## Related Projects

- **SpecOps Methodology**: https://spec-ops.ai
- **SpecOps Repository**: https://github.com/mheadd/spec-ops
- **IRS Direct File**: https://github.com/IRS-Public/direct-file
- **GitHub spec-kit**: https://github.com/github/spec-kit

## Contributing

This is a demonstration repository showing how SpecOps can be applied. The skills developed here are intended to be:
- **Portable**: Usable across different tax systems
- **Shareable**: Applicable to state and federal tax modernization
- **Extensible**: Templates for developing additional skills

## Contact

For questions about the SpecOps methodology, see:
- GitHub Discussions: https://github.com/mheadd/spec-ops/discussions
- Website: https://spec-ops.ai
