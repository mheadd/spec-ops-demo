# AI Agent Instruction Set: Standard Deduction Calculation

**Skill Type:** Tax Calculation Specification  
**Domain:** U.S. Federal Income Tax - Deductions  
**Parent Skill:** Tax Logic Comprehension  
**Version:** 1.0  
**Last Updated:** November 22, 2025

## Purpose

This specialized instruction set guides AI agents in analyzing and documenting standard deduction calculation logic. It focuses on the specific rules, edge cases, and variations that apply to standard deductions in U.S. federal income tax.

## How to Use This Skill

**This is a specialized skill that extends `tax-logic-comprehension.md`**

When analyzing standard deduction code:

1. **First, apply the parent skill** (`tax-logic-comprehension.md`) to:
   - Understand overall tax context
   - Identify IRC references and IRS publication citations
   - Distinguish business logic from technical code
   - Recognize tax terminology

2. **Then, apply this specialized skill** to:
   - Extract specific standard deduction amounts by filing status
   - Document additional deduction rules (age 65+, blindness)
   - Analyze edge cases like the "birthday rule" or MFS special conditions
   - Map deduction logic to IRS Pub 501

**In practice:** Load both skills as context, with the parent skill providing foundational understanding and this skill providing domain-specific pattern recognition for standard deductions.

## Authoritative Sources

- **IRS Publication 501** - Dependents, Standard Deduction, and Filing Information
- **Form 1040** - Lines 12 (Standard Deduction checkbox) and 40 (Deductions)
- **IRC § 63** - Taxable income defined; standard deduction
- **Revenue Procedure (annual)** - Updated amounts for inflation adjustments

## Core Concept

The standard deduction is a fixed dollar amount that reduces taxable income. Most taxpayers choose the standard deduction instead of itemizing deductions. The amount varies based on:

1. **Filing Status** - Single, MFJ, MFS, HoH, QSS
2. **Age** - Additional amount if 65 or older
3. **Blindness** - Additional amount if blind
4. **Dependent Status** - Reduced amount if can be claimed as dependent

## Base Standard Deduction Amounts

### Tax Year 2024 Amounts

Extract and document base amounts by filing status:

| Filing Status | 2024 Amount |
|--------------|-------------|
| Single | $14,600 |
| Married Filing Jointly | $29,200 |
| Married Filing Separately | $14,600 |
| Head of Household | $21,900 |
| Qualifying Surviving Spouse | $29,200 |

**Note:** These amounts are adjusted annually for inflation. Always specify the tax year.

## Additional Standard Deduction

### Age 65 or Older

**Rule:** Taxpayers who are 65 or older by the end of the tax year receive an additional standard deduction.

**Amounts (2024):**
- Single or Head of Household: $1,950
- Married (MFJ or MFS): $1,550 per person
- Qualifying Surviving Spouse: $1,550

**Critical Edge Case - Birthday Rule:**

From IRS Pub 501:
> "You are considered to be 65 on the day before your 65th birthday."

**Implications:**
- Born January 1, 1960 → Considered 65 for tax year 2024
- Born January 2, 1960 → NOT considered 65 for tax year 2024

**Code Patterns to Recognize:**

```typescript
// Check if person turns 65 on January 1 of following year
if (dateOfBirth === '1960-01-01') {
  // Counts as 65 for tax year 2024
}

// Typical implementation
const age65ByEndOfYear = (birthDate, taxYear) => {
  // Must account for "day before birthday" rule
  const effectiveAge = /* calculation */;
  return effectiveAge >= 65;
};
```

**Documentation Format:**

**Additional Deduction for Age 65+:**
- **When Applies:** Taxpayer is 65 or older by December 31 of tax year
- **Birthday Rule:** Age is counted as day BEFORE actual birthday
- **Amount:** Varies by filing status (see table above)
- **Multiple:** MFJ filers can both qualify (2× additional amount)

### Blindness

**Rule:** Taxpayers who are blind receive an additional standard deduction (same amounts as age 65+).

**Definition of Blindness (IRC § 63(f)(4)):**
- Vision cannot be corrected to better than 20/200 in better eye, OR
- Field of vision is 20 degrees or less

**Certification:** Must have statement from eye doctor certifying blindness.

**Can Stack:** Taxpayer can receive both age AND blindness additional amounts.

**Code Patterns to Recognize:**

```typescript
const additionalItems = 0;
if (taxpayer.age >= 65) additionalItems++;
if (taxpayer.isBlind) additionalItems++;
if (spouse.age >= 65) additionalItems++;
if (spouse.isBlind) additionalItems++;

const totalAdditional = additionalItems * amountPerItem;
```

**Maximum Additional (2024, MFJ):**
- Both spouses age 65+ AND blind: 4 × $1,550 = $6,200 additional

## Reduced Standard Deduction

### For Dependents

**Rule:** Taxpayers who can be claimed as a dependent by someone else may have a reduced standard deduction.

**Calculation (2024):**

**Formula:** Greater of:
1. $1,300, OR
2. Earned income + $450 (but not more than the full standard deduction)

**Key Terms:**
- **"Can be claimed"** means eligible to be claimed, even if not actually claimed
- **Earned income** = wages, salaries, tips, self-employment income
- **Unearned income** = interest, dividends, does NOT increase deduction

**When Full Standard Deduction Applies Despite "Can Be Claimed":**

From code analysis, look for these conditions:
- Potential claimer is NOT required to file
- Potential claimer did NOT file
- Potential claimer filed ONLY to get refund of taxes withheld

**Code Patterns to Recognize:**

```typescript
if (canBeClaimed && potentialClaimerMustFile) {
  // Use reduced standard deduction formula
  const reduced = Math.max(
    1300,
    Math.min(earnedIncome + 450, fullStandardDeduction)
  );
}

if (canBeClaimed && 
    !potentialClaimerMustFile && 
    (!potentialClaimerDidFile || filedOnlyForRefund)) {
  // Use full standard deduction
}
```

**Documentation Format:**

**Reduced Standard Deduction for Dependents:**
- **Applies When:** Taxpayer can be claimed as someone else's dependent
- **Calculation:** Max($1,300, earnedIncome + $450), capped at full deduction
- **Exception:** Full deduction if claimer not filing or only filing for refund
- **Additional Amounts:** Dependent CAN still get age/blindness additional amounts

## Married Filing Separately Special Rules

### Spouse's Standard Deduction Can Affect Yours

**Rule:** If one MFS spouse itemizes, the other MFS spouse MUST itemize (cannot take standard deduction).

**MFS Additional Deduction for Spouse:**

Complex rules when living apart:

**Can Claim Spouse's Additional Amount If:**
1. Spouse has NO gross income
2. Spouse is NOT filing a return
3. Spouse cannot be claimed as dependent by someone else

**Code Patterns to Recognize:**

```typescript
if (filingStatus === 'MFS') {
  // Check if spouse is blind or 65+
  // Check spouse's income status
  // Check spouse's filing status
  // Check if spouse can be claimed
  
  if (spouseAge65 && 
      spouseNoIncome && 
      spouseNotFiling && 
      spouseNotDependent) {
    additionalItems++;
  }
}
```

**Critical:** This is ONE of the most complex areas. Tests will show many edge cases:
- Spouse blind but has income: NO additional
- Spouse 65+ but filing return: NO additional  
- Spouse is dependent of someone: NO additional
- Spouse blind AND 65+: Both add IF all conditions met

**Documentation Format:**

**MFS Spouse Additional Deduction Rules:**
- **Scenario:** MFS filer with spouse who meets criteria
- **Requirements (ALL must be true):**
  - Spouse has NO gross income
  - Spouse NOT filing a return
  - Spouse NOT a dependent of anyone
- **Benefit:** Can claim spouse's age/blindness additional amount
- **Amount:** Same as regular additional ($1,550 per item for 2024)

## Deceased Spouse Rules

### When Spouse Dies During Tax Year

**Rule:** Additional deduction for deceased spouse if they met age requirement.

**Timing:**
- Died before age 65 but would have turned 65 by date of death: YES
- Died before turning 65 at all during tax year: NO

**Filing Status Impact:**
- Can file MFJ in year of death
- For standard deduction, count age at date of death

**Code Patterns to Recognize:**

```typescript
if (maritalStatus === 'widowed' && yearOfSpouseDeath === taxYear) {
  // Check if spouse turned 65 before death
  // Check date of death vs. spouse birthday
  
  if (spouseTurned65BeforeDeath(dateOfBirth, dateOfDeath)) {
    additionalItems++; // Can claim spouse's age additional
  }
}
```

## What to Extract from Code

When analyzing standard deduction code, document:

### 1. Base Amounts
- [ ] Tax year specified
- [ ] All five filing status amounts
- [ ] Source (Revenue Procedure if referenced)

### 2. Additional Amounts
- [ ] Age 65+ amounts by filing status
- [ ] Blindness amounts by filing status
- [ ] Birthday calculation rule
- [ ] Stacking rules (can get both age and blindness)

### 3. Dependent Rules
- [ ] Reduced calculation formula
- [ ] Earned income definition
- [ ] Exception conditions (claimer not filing, etc.)
- [ ] Additional amounts still apply

### 4. MFS Special Rules
- [ ] Spouse's itemization requirement
- [ ] Conditions for claiming spouse's additional
- [ ] All four conditions listed and verified

### 5. Deceased Spouse Rules
- [ ] Age determination at death
- [ ] Filing status eligibility
- [ ] Additional amount calculation

### 6. Edge Cases from Tests
- [ ] January 1 birthday rule
- [ ] Multiple additional items calculation
- [ ] Spouse conditions for MFS
- [ ] Claiming vs. can be claimed distinction

## Test Analysis Guide

Standard deduction tests typically organize by:

1. **Filing Status Groups**
   - Single/HoH (similar rules)
   - MFJ (both spouses can add)
   - MFS (complex spouse rules)
   - QSS (similar to MFJ)

2. **Test Categories**
   - Base amount tests
   - Age additional tests
   - Blindness additional tests
   - Combined age + blindness
   - Dependent reduction tests
   - MFS spouse rules
   - Edge case birthday tests

3. **Test Naming Patterns**

Look for test names like:
- `"additional items are zero if not blind or over 65"`
- `"counts January 1 of next year as 65"`
- `"Does not count January 2 of next year as 65"`
- `"Provides 4 deduction items if both TP and Spouse over 65 and blind"`

Each test name describes a specific business rule.

## Common Code Patterns

### Pattern 1: Age Calculation with Birthday Rule

```typescript
const birthYearIfTurnedXInTaxYear = (x: number) => 
  parseInt(CURRENT_TAX_YEAR) - x;

// Testing Jan 1 birthday
const yob = birthYearIfTurnedXInTaxYear(64);
const birthDate = `${yob}-01-01`; // Counts as 65

// Testing Jan 2 birthday
const birthDate2 = `${yob}-01-02`; // Does NOT count as 65
```

**Document as:** "Birthday rule implementation - person is age X if they turn X on or before January 1 of following year"

### Pattern 2: Additional Items Counter

```typescript
let additionalStandardDeductionItems = 0;

if (primaryFiler.age65OrOlder) additionalStandardDeductionItems++;
if (primaryFiler.isBlind) additionalStandardDeductionItems++;

if (isSpouseApplicable && secondaryFiler.age65OrOlder) {
  additionalStandardDeductionItems++;
}
if (isSpouseApplicable && secondaryFiler.isBlind) {
  additionalStandardDeductionItems++;
}

const totalAdditional = additionalStandardDeductionItems * 
  additionalAmountPerItem[filingStatus];
```

**Document as:** "Each qualifying condition adds one item. Total additional deduction = number of items × per-item amount for filing status."

### Pattern 3: MFS Spouse Conditions

```typescript
const canClaimSpouseAdditional = 
  filingStatus === 'MFS' &&
  spouseHasNoGrossIncome &&
  !spouseFilingReturn &&
  !spouseCanBeClaimed;

if (canClaimSpouseAdditional) {
  if (spouse.age65OrOlder) additionalItems++;
  if (spouse.isBlind) additionalItems++;
}
```

**Document as:** "MFS filer can claim spouse's additional amounts only if ALL four conditions are met: [list conditions]. Each qualifying factor (age 65+, blindness) adds one item."

## Output Template

Use this structure when documenting standard deduction logic:

---

### Standard Deduction Specification

**Tax Year:** [Year]  
**Source Authority:** IRS Publication 501, IRC § 63  
**Related Forms:** Form 1040, line 12

#### Base Standard Deduction Amounts

[Table with all five filing statuses]

**Notes:**
- Amounts adjusted annually for inflation
- QSS receives same amount as MFJ

#### Additional Standard Deduction

**Additional Amount Per Item:**
- Single/HoH: $[amount]
- MFJ/MFS/QSS: $[amount]

**Qualifying Conditions (each adds one item):**
1. **Age 65 or Older**
   - Counted as day before actual birthday
   - Must be 65 by December 31 of tax year
   - Exception: January 1 of following year counts

2. **Blindness**
   - Certified by eye doctor
   - Specific vision standards (20/200 or 20° field)

**Multiple Items:**
- Taxpayer can receive both age AND blindness items
- MFJ: Each spouse evaluated separately (maximum 4 items)

#### Reduced Standard Deduction for Dependents

**Applies When:** Taxpayer can be claimed as dependent

**Calculation:**
```
Greater of:
  1. $1,300, OR
  2. (Earned Income + $450)
  
Capped at: Regular standard deduction amount
```

**Exception - Full Deduction Despite "Can Be Claimed":**
- Potential claimer NOT required to file, AND
- Potential claimer did NOT file, OR
- Potential claimer filed ONLY for refund

**Additional Amounts:** Dependent can STILL receive age/blindness additional amounts

#### Married Filing Separately Special Rules

**Itemization Requirement:**
- If one MFS spouse itemizes, other MUST itemize

**Claiming Spouse's Additional Amount:**

Allowed ONLY if ALL conditions met:
1. Spouse has NO gross income
2. Spouse NOT filing a return
3. Spouse NOT a dependent
4. Filing status is MFS

If all conditions met, can add spouse's:
- Age 65+ item (if applicable)
- Blindness item (if applicable)

#### Deceased Spouse

**Rule:** Can claim deceased spouse's additional amounts if:
- Filing MFJ in year of death
- Spouse met age/blindness criteria by date of death

**Age Determination:** Use spouse's age at date of death

#### Edge Cases and Special Situations

1. **January 1 Birthday:** Counts as age for tax year
2. **January 2 Birthday:** Does NOT count for tax year
3. **Both Spouses Blind and 65+:** 4 additional items × amount
4. **MFS Spouse Requirements:** All four must be true
5. **Dependent with Earned Income:** Use formula with earned income

#### Code References

[List file paths and line numbers]

---

## Validation Checklist

After documenting standard deduction logic:

- [ ] Tax year clearly specified
- [ ] All base amounts documented
- [ ] Additional amounts by filing status documented
- [ ] Birthday rule explained
- [ ] Age AND blindness can stack
- [ ] Dependent reduction formula correct
- [ ] MFS spouse conditions (all four) listed
- [ ] Deceased spouse rules documented
- [ ] Edge cases captured
- [ ] Code references provided

## Related Skills

- **Tax Logic Comprehension** (parent skill)
- **Dependent Qualification** (for "can be claimed" determination)
- **Filing Status Rules** (for understanding MFJ vs MFS vs HoH)

---

**Skill Status:** Production Ready  
**Testing:** Validated against IRS Direct File examples  
**Next Review:** When tax year 2025 amounts are published
