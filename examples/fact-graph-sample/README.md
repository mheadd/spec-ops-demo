# Scala Fact Graph Examples

This directory contains code samples from IRS Direct File demonstrating the Fact Graph architecture.

## Source

Extracted from: https://github.com/IRS-Public/direct-file

## What is the Fact Graph?

From the Direct File documentation:

> Direct File incorporates the Fact Graph, a declarative, XML-based knowledge graph data structure that is designed to reason about incomplete information, such as a partially completed tax return. The Fact Graph is written in the Scala programming language; it runs on the JVM on the backend and is transpiled via Scala.js to run on the client as well.

## Key Characteristics

1. **Declarative XML-based** - Business rules are defined in XML, not procedural code
2. **Bidirectional sync** - Runs on both backend (JVM) and frontend (JavaScript via Scala.js)
3. **Incomplete information reasoning** - Can compute derived facts even when some writable facts are missing
4. **Type-safe** - Strong typing for Dollar amounts, Dates, Enums, Booleans, etc.

## What This Code Demonstrates

### Tax Bracket Calculation

The example shows how tax brackets are implemented for Tax Year 2024, Married Filing Jointly status:

- **Not over $23,200**: 10% of taxable income
- **Over $23,200 but not over $94,300**: $2,320 plus 12% of excess over $23,200
- **Over $94,300 but not over $201,050**: $10,852 plus 22% of excess over $94,300
- And so on through all tax brackets...

### Key Patterns in Fact Graph

1. **Switch/Case statements** - Similar to pattern matching, evaluates conditions in order
2. **Dependency resolution** - `<Dependency path="../taxableIncome" />` references other facts
3. **Arithmetic operations** - Add, Subtract, Multiply, Divide with explicit role labeling
4. **Rounding rules** - `<Round>` implements IRS-specific rounding (50 cents always rounds up)
5. **Rational numbers** - Tax rates as fractions (e.g., `<Rational>35/100</Rational>` for 35%)

## Why This Matters for Spec Ops

The Fact Graph is **a specification language disguised as code**. It's:
- **Declarative** - Describes WHAT, not HOW
- **Readable** - XML structure mirrors tax form logic
- **Cross-platform** - Same logic runs client and server
- **Testable** - Can validate against IRS publications

However, tax policy experts still can't verify this directly. A Spec Ops approach would:
1. Extract the business rules from the XML
2. Generate plain-language specifications
3. Have tax experts verify against IRS Publication 17, Publication 525, etc.
4. Use verified specs to regenerate/validate the Fact Graph XML

## Files in This Example

- `tax-bracket-calculation.sc` - Scala worksheet showing tax calculation logic
- `fact-graph-structure.md` - Documentation of Fact Graph patterns
- `README.md` - This file

## Learning Resources

From Direct File repository:
- `direct-file/fact-graph-scala/shared/src/main/scala/_tutorial/` - Interactive tutorials
- `direct-file/backend/src/main/resources/tax/` - Actual tax logic definitions