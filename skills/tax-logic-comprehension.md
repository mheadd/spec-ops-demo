# AI Agent Instruction Set: Tax Logic Comprehension

**Skill Type:** Foundation/Parent Skill  
**Domain:** U.S. Federal Income Tax Systems  
**Target Systems:** IRS Direct File, state tax systems, tax preparation software  
**Version:** 1.0  
**Last Updated:** November 22, 2025

## Purpose

This instruction set guides AI agents in analyzing tax system source code to extract and document business logic related to U.S. federal income tax calculations. The goal is to produce human-readable specifications that tax policy experts can verify against IRS publications and regulations.

**This is a foundation skill** - It provides core tax comprehension that other specialized skills build upon. Use this skill for general tax code analysis, or combine it with specialized skills for specific domains (standard deductions, dependent qualification, etc.).

## Specialized Skills That Extend This One

- **Standard Deduction Calculation** - For analyzing standard deduction amounts and edge cases
- **Dependent Qualification Comprehension** - For analyzing qualifying child and qualifying relative rules
- **Scala Fact Graph Comprehension** - For analyzing declarative XML-based knowledge graphs

When using specialized skills, apply this foundation skill first to establish tax context, then layer on the specialized patterns.

## Core Principles

1. **Tax law is the source of truth, not the code** - Code may contain bugs or outdated interpretations
2. **Distinguish business logic from technical plumbing** - Focus on tax rules, not framework code
3. **Identify authoritative sources** - Link logic to specific IRS publications, forms, and IRC sections
4. **Flag ambiguities** - Note where code logic may not match published guidance
5. **Preserve institutional knowledge** - Capture the "why" behind complex rules, not just the "what"

## Key Concepts to Recognize

### IRC References
- **Internal Revenue Code (IRC)** - Title 26 of U.S. Code (e.g., "26 USC § 151")
- Code comments may reference IRC sections directly
- Example: `// IRC 24(c)(1) - Child Tax Credit phase-out begins at $400,000 MFJ`

### IRS Publications
- **Pub 17** - Your Federal Income Tax (general taxpayer guide)
- **Pub 501** - Dependents, Standard Deduction, and Filing Information
- **Pub 502** - Medical and Dental Expenses
- **Pub 503** - Child and Dependent Care Expenses
- **Pub 596** - Earned Income Credit (EITC)
- **Pub 972** - Child Tax Credit

### Tax Forms
- **Form 1040** - U.S. Individual Income Tax Return (main form)
- **Schedule 1** - Additional Income and Adjustments to Income
- **Schedule 2** - Additional Taxes
- **Schedule 3** - Additional Credits and Payments
- **Schedule 8812** - Credits for Qualifying Children and Other Dependents
- **Schedule EIC** - Earned Income Credit

### Common Tax Terms

**Filing Status:**
- Single
- Married Filing Jointly (MFJ)
- Married Filing Separately (MFS)
- Head of Household (HoH)
- Qualifying Surviving Spouse (QSS)

**Dependent Types:**
- Qualifying Child (QC) - Must meet age, relationship, residency, support tests
- Qualifying Relative (QR) - Different test criteria than QC

**Income Types:**
- Earned Income - Wages, salaries, tips, self-employment
- Unearned Income - Interest, dividends, capital gains
- Adjusted Gross Income (AGI) - Total income minus specific deductions
- Modified AGI (MAGI) - AGI with certain items added back

**Deduction Types:**
- Standard Deduction - Fixed amount based on filing status
- Itemized Deductions - Specific expenses (mortgage interest, charity, etc.)
- Above-the-line Deductions - Subtracted to calculate AGI

**Tax Credits:**
- Refundable Credits - Can result in refund (e.g., EITC, Additional CTC)
- Non-refundable Credits - Can only reduce tax owed to zero (e.g., CTC)

## Patterns to Identify

### 1. Tax Year-Specific Logic

Tax law changes annually. Look for:
```typescript
const CURRENT_TAX_YEAR = '2024';
const STANDARD_DEDUCTION_SINGLE = 14600; // 2024 amount
```

**What to document:** Note the tax year and that amounts may change annually.

### 2. Thresholds and Phase-Outs

Many tax benefits have income limits:
```typescript
if (agi > 200000 && filingStatus === 'single') {
  // Additional Medicare Tax applies
}
```

**What to document:** The threshold amount, what it applies to, and any filing status variations.

### 3. Age Calculations

Tax law has special birthday rules:
```typescript
// IRS Pub 501: Your birthday is considered the day before your actual birthday
// Someone turning 65 on January 1, 2025 is considered 65 for tax year 2024
```

**What to document:** The specific rule, its source (Pub 501), and why it matters.

### 4. Multi-Factor Tests

Qualifying as a dependent requires passing ALL tests:
```typescript
const isQualifyingChild = 
  passesRelationshipTest && 
  passesAgeTest && 
  passesResidencyTest && 
  passesSupportTest && 
  passesJointReturnTest;
```

**What to document:** List all required tests, what each test evaluates, and the consequences of failing any test.

### 5. Tiebreaker Rules

When multiple people can claim the same benefit:
```typescript
if (bothParentsCouldClaim) {
  // Parent with higher AGI claims the child
  claimer = agi1 > agi2 ? parent1 : parent2;
}
```

**What to document:** The tiebreaker criteria and the order of priority.

## Analysis Approach

### Step 1: Identify the Tax Concept

Before analyzing code, determine:
- What tax benefit or calculation is this implementing?
- What IRS form or schedule does this relate to?
- What tax year is this for?

### Step 2: Extract Business Rules

Look for:
- Conditional logic (if/then/else)
- Threshold values
- Mathematical calculations
- Test criteria
- Eligibility requirements

### Step 3: Map to Authoritative Sources

For each rule found, identify:
- The IRC section (if referenced)
- The IRS publication that explains it
- The tax form that uses it
- Any worksheets that calculate it

### Step 4: Document Edge Cases

Pay special attention to:
- Exception clauses
- Special rules for specific situations
- Comments explaining unusual logic
- Test cases for boundary conditions

### Step 5: Flag Uncertainties

Note where:
- Code logic seems to contradict published guidance
- Comments indicate complexity or ambiguity
- Multiple interpretations are possible
- Business rule is unclear or incomplete

## Output Format

When documenting tax logic, structure as:

### Rule: [Brief Description]

**IRS Authority:** [Pub/Form reference]  
**IRC Section:** [If applicable]  
**Tax Year:** [Specific year or "annual"]  
**Applies To:** [Filing statuses/taxpayer types]

**Business Rule:**  
[Plain language description of what the rule does]

**Conditions:**  
- Condition 1: [Description]
- Condition 2: [Description]

**Calculation:**  
[If applicable, mathematical formula in plain language]

**Edge Cases:**  
- [Special situation 1]
- [Special situation 2]

**Notes:**  
[Any additional context, rationale, or uncertainties]

**Code Reference:**  
[File path and line numbers]

## Examples

### Good Documentation

**Rule:** Additional Standard Deduction for Age 65 or Older

**IRS Authority:** IRS Publication 501, Table 7  
**IRC Section:** 26 USC § 63(c)(3), § 63(f)  
**Tax Year:** Annual (amounts change)  
**Applies To:** All filing statuses

**Business Rule:**  
Taxpayers who are 65 or older by the end of the tax year receive an additional standard deduction amount. The increase varies by filing status.

**Conditions:**  
- Must be 65 or older by December 31 of the tax year
- IRS Pub 501 rule: Birthday is counted as the day BEFORE the actual birthday
- Therefore, someone born January 1, 1960 is considered 65 for tax year 2024

**Amounts (2024):**
- Single or Head of Household: $1,950 additional
- Married Filing Jointly (per person): $1,550 additional
- Married Filing Separately (per person): $1,550 additional

**Edge Cases:**  
- Married Filing Jointly: Both spouses can qualify, resulting in $3,100 additional
- Deceased spouse: Counts as 65 if would have turned 65 by date of death in tax year
- Married Filing Separately: Spouse's age can affect your deduction under certain conditions

**Notes:**  
The "day before birthday" rule is counterintuitive but essential for correct calculation. This same rule applies to all age-based tax determinations.

**Code Reference:**  
`direct-file/df-client/df-client-app/src/test/factDictionaryTests/standardDeduction.test.ts`, lines 149-157

---

### Good Documentation

**Rule:** Qualifying Child Age Test for Dependents

**IRS Authority:** IRS Publication 501, Chapter 3  
**IRC Section:** 26 USC § 152(c)(3)  
**Tax Year:** Permanent (unless amended)  
**Applies To:** All taxpayers claiming dependents

**Business Rule:**  
To be a qualifying child, the person must be under age 19, OR under age 24 if a full-time student, OR permanently and totally disabled (any age).

**Conditions:**  
- Default age limit: Under 19 at end of tax year
- Student exception: Under 24 at end of tax year AND full-time student for at least 5 months
- Disability exception: Any age if permanently and totally disabled
- Must be younger than the taxpayer claiming them (with exceptions for disability)

**Full-Time Student Definition:**
- Enrolled at least 5 calendar months during the tax year
- At eligible educational institution
- Carrying full course load per institution's standards

**Edge Cases:**  
- Person turns 19, 24, etc. on December 31: Still counts as that age for the year
- Temporary disability: Does NOT qualify for age exception
- Graduate student: Qualifies for student exception if under 24 and full-time

**Notes:**  
The age test is ONE of five tests for qualifying child status. Must pass ALL five tests (relationship, age, residency, support, joint return) to qualify as a dependent.

**Code Reference:**  
`direct-file/df-client/df-client-app/src/test/factDictionaryTests/dependents.test.ts`, lines 58-95

## Special Considerations

### Fact Graph Systems

If analyzing declarative Fact Graph code (XML-based), note:
- `<Writable>` facts are user-entered data
- `<Derived>` facts are calculated from other facts
- `<Dependency>` elements reference other facts by path
- `<Switch>/<Case>` structures implement conditional logic
- Operation names are semantic (Add, Subtract, Multiply, Round, etc.)

Document what the logic DOES in tax terms, not how the Fact Graph implements it.

### Test-Driven Logic

When analyzing test files:
- Each test typically demonstrates a specific edge case or rule
- Test names often describe the business rule being tested
- Test data setup reveals required inputs for calculations
- Assertions show expected outcomes

Use tests to understand the full scope of a feature's behavior.

## Anti-Patterns to Avoid

❌ **Don't** just describe the code structure  
✅ **Do** extract the tax business rule

❌ **Don't** use technical jargon (factGraph, createBooleanWrapper, etc.)  
✅ **Do** use tax terminology (taxpayer, dependent, filing status, etc.)

❌ **Don't** copy code comments verbatim without context  
✅ **Do** interpret and expand on comments with authoritative sources

❌ **Don't** document framework/plumbing code  
✅ **Do** focus only on tax calculation and eligibility logic

❌ **Don't** assume code is correct  
✅ **Do** flag logic that seems inconsistent with published IRS guidance

## Verification Checklist

After documenting tax logic, verify:

- [ ] Identified the specific tax concept/benefit
- [ ] Linked to IRS publication or form
- [ ] Used plain language a tax professional would understand
- [ ] Listed all conditions and requirements
- [ ] Documented edge cases and exceptions
- [ ] Noted the tax year (if amount changes annually)
- [ ] Flagged any uncertainties or ambiguities
- [ ] Included code reference for traceability

## When to Use This Skill

Apply this instruction set when:
- Analyzing tax system source code
- Generating specifications from tax calculation logic
- Documenting eligibility rules for tax benefits
- Extracting business rules from test cases
- Creating plain-language documentation for tax policy review

## Related Skills

- **Scala Fact Graph Comprehension** - For declarative XML-based tax logic
- **Standard Deduction Calculation** - Specific skill for standard deduction rules
- **Dependent Qualification Rules** - Specific skill for dependent determination
- **Tax Calculation Formulas** - For progressive tax brackets and calculations

---

**Skill Maintainer:** SpecOps Demo Project  
**Feedback:** Update this skill based on lessons learned during specification generation
