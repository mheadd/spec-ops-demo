# AI Agent Instruction Set: Dependent Qualification Comprehension

## Purpose

This instruction set teaches an AI agent to analyze code that determines whether a person qualifies as a dependent for federal tax purposes. The agent will extract the five tests for "qualifying child" status, the four tests for "qualifying relative" status, and tiebreaker rules when multiple taxpayers could claim the same dependent.

## How to Use This Skill

**This is a specialized skill that extends `tax-logic-comprehension.md`**

When analyzing dependent qualification code:

1. **First, apply the parent skill** (`tax-logic-comprehension.md`) to:
   - Understand overall tax context and terminology
   - Identify IRC references (particularly § 152)
   - Recognize IRS publication citations (especially Pub 501, Pub 972)
   - Distinguish business logic from technical infrastructure

2. **Then, apply this specialized skill** to:
   - Extract the five tests for qualifying child determination
   - Extract the four tests for qualifying relative determination  
   - Document tiebreaker rules for multiple claimants
   - Analyze relationship hierarchies and edge cases
   - Map dependent qualification to downstream tax benefits (CTC, EITC, HoH)

**In practice:** Load both skills as context, with the parent skill providing foundational tax knowledge and this skill providing specific pattern recognition for dependent qualification logic.

## Prerequisites

**Parent Skill**: Tax Logic Comprehension (`tax-logic-comprehension.md`)

**Required Knowledge**:
- Basic understanding of tax dependencies between family members
- Familiarity with enumeration patterns in tax code
- Understanding of boolean logic chains (all tests must pass)

**Context**: Dependent qualification affects multiple tax benefits including:
- Personal exemptions (historically)
- Child Tax Credit (CTC)
- Earned Income Tax Credit (EITC)
- Head of Household filing status
- Dependent care credits

## Core Concepts

### 1. Two Categories of Dependents

#### Qualifying Child (QC)
Generally younger dependents with close family relationships (children, siblings, descendants) who live with the taxpayer.

**The Five Tests**:
1. **Relationship Test**: Must be child, stepchild, foster child, sibling, half-sibling, or descendant
2. **Age Test**: Under 19, OR under 24 if full-time student, OR any age if permanently disabled
3. **Residency Test**: Lived with taxpayer for more than half the year
4. **Support Test**: Did NOT provide more than half of own support
5. **Joint Return Test**: Did not file joint return (unless only to claim refund)

#### Qualifying Relative (QR)
Broader category including parents, other relatives, or non-relatives who depend on taxpayer's support.

**The Four Tests**:
1. **Not a Qualifying Child Test**: Cannot be a qualifying child of any taxpayer
2. **Member of Household or Relationship Test**: Either lived with taxpayer all year OR is related by blood/marriage
3. **Gross Income Test**: Gross income less than exemption amount ($4,700 for 2024)
4. **Support Test**: Taxpayer provided more than half of person's total support

### 2. Critical Edge Cases

#### Age Test Nuances
```
Under 19 at end of tax year: Qualifies (no other conditions)
Age 19-23 at end of year: Qualifies IF full-time student for ≥5 months
Any age: Qualifies IF permanently and totally disabled
Younger than taxpayer: Generally required (except for disabled dependents)
```

#### Residency Test Exceptions
Temporary absences count as time lived with taxpayer:
- Education (boarding school, college)
- Military service
- Medical treatment
- Vacation
- Incarceration (for minors)

Born or died during year: Residency calculated for time person was alive

#### Joint Return Test Exception
If dependent files joint return ONLY to claim refund of withheld taxes, and neither spouse had filing requirement, the test is passed.

#### Support Test Complexity
What counts as support:
- Food, lodging, clothing
- Education expenses
- Medical and dental care
- Transportation
- Recreation

What doesn't count:
- Scholarships (for full-time students)
- Tax-exempt income used for own support

### 3. Tiebreaker Rules (Qualifying Child of Another)

When multiple taxpayers could claim the same qualifying child, priority order:

1. **Parent over non-parent**: Parent always gets priority
2. **Between parents (not filing jointly)**:
   - Parent with whom child lived longest gets priority
   - If equal time, parent with higher AGI gets priority
3. **Non-parent vs. non-parent**: Person with higher AGI gets priority

**Special notation**: `isQualifyingChildOfAnother` flag indicates when dependency should be disallowed due to tiebreaker loss.

## Analysis Patterns

### Pattern 1: Five-Test Conjunction for Qualifying Child

**Recognition Markers**:
- Boolean fields named like `qcRelationshipTest`, `qcAgeTest`, `qcResidencyTest`
- Final determination combines all five tests (logical AND)
- Code paths that check `qualifyingChild` boolean result

**What to Extract**:
```
Specification Output:
"A person is a qualifying child if ALL of the following tests pass:
1. Relationship Test: [describe allowed relationships from code]
2. Age Test: [describe age thresholds and student/disability exceptions]
3. Residency Test: [describe residency duration requirement]
4. Support Test: [describe support limitation]
5. Joint Return Test: [describe joint filing restriction and exception]"
```

**Example Code Pattern**:
```typescript
const qualifyingChild = 
  qcRelationshipTest && 
  qcAgeTest && 
  qcResidencyTest && 
  qcSupportTest && 
  jointReturnTest;
```

### Pattern 2: Age Test with Cascading Conditions

**Recognition Markers**:
- Age calculations using `dateOfBirth` and `endOfTaxYear`
- Boolean flags: `isFullTimeStudent`, `hasDisability`, `isPermanentDisability`
- Conditional logic: "under 19 OR (under 24 AND student) OR (disabled)"

**What to Extract**:
```
Specification Output:
"Age Test passes if:
- Person is under age 19 at end of tax year, OR
- Person is under age 24 at end of tax year AND was full-time student 
  for at least 5 months, OR
- Person is permanently and totally disabled (any age)

Additionally, person must be younger than taxpayer claiming them 
(except when permanently disabled)."
```

**Example Code Pattern**:
```typescript
const ageAtEndOfYear = calculateAge(dateOfBirth, taxYearEnd);
const passesAgeTest = 
  ageAtEndOfYear < 19 ||
  (ageAtEndOfYear < 24 && isFullTimeStudent) ||
  isPermanentDisability;
```

### Pattern 3: Residency Duration Enumerations

**Recognition Markers**:
- Enumeration fields: `residencyDuration`, `residencyDurationOptions`
- Values like: `moreThanSixMonths`, `lessThanSixMonths`, `allYear`, `none`
- Test passes for "more than half the year" variants

**What to Extract**:
```
Specification Output:
"Residency Test requires the person to have lived with the taxpayer for 
more than half the year (generally more than 6 months).

Temporary absences count as time lived with taxpayer, including:
- Educational attendance
- Medical treatment
- Vacation
- Military service

If person was born or died during the tax year, calculate residency 
for the portion of the year they were alive."
```

**Example Code Pattern**:
```typescript
const qcResidencyTest = 
  residencyDuration === 'moreThanSixMonths' || 
  residencyDuration === 'allYear';
```

### Pattern 4: Support Test Direction

**Recognition Markers**:
- For QC: Check that dependent did NOT provide >50% of own support
- For QR: Check that taxpayer DID provide >50% of dependent's support
- Boolean: `ownSupport` (for QC) vs. calculation of taxpayer's contribution (for QR)

**What to Extract**:
```
Specification Output for Qualifying Child:
"Support Test requires that the person did NOT provide more than half 
of their own support during the tax year.

Sources of support include: lodging, food, clothing, education, medical, 
recreation, transportation.

Scholarships received by full-time students are not counted as support 
provided by the student."

Specification Output for Qualifying Relative:
"Support Test requires that the taxpayer provided MORE than half of the 
person's total support during the tax year.

Calculate as: (Taxpayer's Support / Total Support) > 50%"
```

**Example Code Pattern**:
```typescript
// Qualifying Child pattern
const qcSupportTest = !ownSupport; // Dependent must NOT be self-supporting

// Qualifying Relative pattern  
const qrSupportTest = taxpayerSupport > (totalSupport / 2);
```

### Pattern 5: Joint Return Test with Refund Exception

**Recognition Markers**:
- Check if dependent is married and filed joint return
- Exception path for "filing only to claim refund"
- Additional check: neither spouse had tax liability

**What to Extract**:
```
Specification Output:
"Joint Return Test generally fails if the dependent is married and 
files a joint return with their spouse.

EXCEPTION: The test passes if the dependent filed a joint return ONLY 
to claim a refund of withheld income tax or estimated tax paid, and 
neither the dependent nor their spouse would have had a tax liability 
if they had filed separate returns."
```

**Example Code Pattern**:
```typescript
const jointReturnTest = 
  !filingJointReturn || 
  (filingOnlyForRefund && 
   !spouseHasTaxLiability && 
   !dependentHasTaxLiability);
```

### Pattern 6: Relationship Categories and Hierarchies

**Recognition Markers**:
- Enumeration: `relationshipCategory` with values like `childOrDescendants`, `siblings`, `parents`, `other`
- Sub-categories: `childRelationship` with `biologicalChild`, `adoptedChild`, `stepchild`, `fosterChild`
- Different allowed relationships for QC vs QR

**What to Extract**:
```
Specification Output for Qualifying Child:
"Relationship Test passes if person is taxpayer's:
- Son, daughter, stepchild, foster child
- Brother, sister, half-brother, half-sister, stepbrother, stepsister
- Descendant of any of the above (grandchild, niece, nephew)

Adopted children are treated the same as biological children."

Specification Output for Qualifying Relative:
"Relationship Test passes if person is taxpayer's:
- Parent, grandparent, or other direct ancestor
- Stepparent (but not former stepparent after divorce)
- Sibling (including half and step siblings)
- Aunt, uncle, niece, nephew (by blood)
- Son-in-law, daughter-in-law, parent-in-law (relationship continues after death)

OR person lived with taxpayer as member of household for entire year 
(non-relative provision)."
```

**Example Code Pattern**:
```typescript
const qcRelationshipTest = 
  relationshipCategory === 'childOrDescendants' ||
  relationshipCategory === 'siblings' ||
  (relationshipCategory === 'other' && isDescendantOfSibling);

const qrRelationshipTest =
  relationshipCategory === 'parents' ||
  relationshipCategory === 'siblings' ||
  relationshipCategory === 'inLaws' ||
  (livedWithAllYear && isHouseholdMember);
```

### Pattern 7: Tiebreaker Logic

**Recognition Markers**:
- Field: `isQualifyingChildOfAnother`
- Comparison logic checking multiple claimants
- AGI (Adjusted Gross Income) comparisons
- Parent status checks

**What to Extract**:
```
Specification Output:
"When a child meets qualifying child criteria for multiple taxpayers, 
apply tiebreaker rules:

1. If one claimant is a parent and the other is not, the parent has 
   priority.

2. If both claimants are parents but not filing jointly:
   - Child lived with one parent longer: That parent has priority
   - Child lived with both parents equal time: Parent with higher AGI 
     has priority

3. If neither claimant is a parent:
   - Claimant with higher AGI has priority

The taxpayer who loses the tiebreaker must mark the person as 
'qualifying child of another' and cannot claim dependent-related benefits 
for that person."
```

**Example Code Pattern**:
```typescript
const determineTiebreaker = (claimant1, claimant2) => {
  if (claimant1.isParent && !claimant2.isParent) return claimant1;
  if (claimant2.isParent && !claimant1.isParent) return claimant2;
  
  if (claimant1.isParent && claimant2.isParent) {
    if (claimant1.residencyDays > claimant2.residencyDays) return claimant1;
    if (claimant2.residencyDays > claimant1.residencyDays) return claimant2;
  }
  
  return claimant1.agi > claimant2.agi ? claimant1 : claimant2;
};
```

### Pattern 8: Citizenship and Residency Requirements

**Recognition Markers**:
- Fields checking: `usCitizen`, `usNationalOrResident`, `residentOfCanadaMexico`
- Combined with dependent tests

**What to Extract**:
```
Specification Output:
"General Dependent Requirement: The person must be:
- A U.S. citizen, OR
- A U.S. national, OR  
- A U.S. resident alien, OR
- A resident of Canada or Mexico (for part of the year)

This applies to both qualifying children and qualifying relatives."
```

## Special Considerations

### 1. Interaction with Tax Credits

**Context**: Dependent qualification affects multiple credits differently:

- **Child Tax Credit**: Requires qualifying child status + additional age restriction (under 17)
- **EITC**: Has its own definition of "qualifying child" that's similar but not identical
- **Dependent Care Credit**: May use different age thresholds (under 13)

**What to Document**:
```
"Note: While [person] may qualify as a dependent under general rules, 
specific tax credits have additional requirements:

- Child Tax Credit requires qualifying child be under age 17
- EITC has separate qualifying child definition (refer to IRC §32)
- Credit for Other Dependents (ODC) available for non-child-tax-credit 
  dependents"
```

### 2. Divorced or Separated Parents

**Special Rules**:
- Custodial parent (where child lived most) generally has claim
- Non-custodial parent can claim if custodial parent releases claim (Form 8332)
- Pre-1985 divorce decrees may have different rules

**What to Document**:
```
"For children of divorced/separated parents:
- Custodial parent (parent with whom child lived most nights) has 
  claiming priority
- Custodial parent can release claim to non-custodial parent via 
  Form 8332
- Release can be for one year, multiple years, or all future years"
```

### 3. Multiple Support Agreements

**Scenario**: When multiple people together provide >50% support, but no single person provides >50%

**What to Document**:
```
"Multiple Support Agreement (Form 2120): When two or more people together 
provide more than half of a person's support, but no single person provides 
more than half, those who provide more than 10% can agree that one person 
claims the dependent.

Requirements:
- Claiming person must provide >10% of support
- All others providing >10% must sign Form 2120
- Only one person can claim the dependent per year"
```

## Output Template

When analyzing dependent qualification code, structure your specification as:

```markdown
# Dependent Qualification Specification

## Overview
[Brief description of what dependency determination affects]

## Qualifying Child Requirements

A person qualifies as a **qualifying child** if ALL five tests pass:

### 1. Relationship Test
[Describe allowed relationships]

### 2. Age Test  
[Describe age thresholds and exceptions]

### 3. Residency Test
[Describe residency duration and exceptions]

### 4. Support Test
[Describe support limitations]

### 5. Joint Return Test
[Describe joint filing restriction and exception]

## Qualifying Relative Requirements

A person qualifies as a **qualifying relative** if ALL four tests pass:

### 1. Not a Qualifying Child Test
[Explain exclusion]

### 2. Member of Household or Relationship Test
[Describe relationships or residency requirement]

### 3. Gross Income Test
[State income threshold]

### 4. Support Test  
[Describe taxpayer support requirement]

## Tiebreaker Rules

When multiple taxpayers could claim the same qualifying child:
[List priority rules]

## Edge Cases and Exceptions

### [Edge Case Name]
**Scenario**: [Describe situation]  
**Rule**: [State how code handles it]  
**IRC Reference**: [If found in code comments]

## Impact on Tax Benefits

This dependency determination affects:
- [List credits/deductions/filing status impacts]

## Implementation Notes

[Any technical details about how the code implements these rules,
such as fact graph paths, test flag combinations, etc.]
```

## Quality Checks

Before finalizing your specification, verify:

1. **All Five QC Tests Documented**: Have you specified each of the five qualifying child tests?
2. **All Four QR Tests Documented**: Have you specified each of the four qualifying relative tests?
3. **Tiebreaker Rules Clear**: Are priority rules for multiple claimants specified?
4. **Age Exception Clarity**: Are all three age test paths clear (under 19, student under 24, disabled any age)?
5. **Joint Return Exception**: Is the "filing only for refund" exception documented?
6. **Residency Exceptions**: Are temporary absences addressed?
7. **Support Direction**: Is it clear which direction the support test goes for QC vs QR?
8. **Relationship Hierarchies**: Are relationship categories organized logically?

## Example Analysis Output

```markdown
## Qualifying Child Age Test

A person passes the **Age Test** if they meet ANY of these conditions at 
the end of the tax year:

1. **Under Age 19**: Person is younger than 19 years old
   - Example: Person born on January 1, 2006 is age 18 on December 31, 2024 → Passes

2. **Student Under Age 24**: Person is younger than 24 years old AND was a 
   full-time student for at least 5 months during the tax year
   - Full-time student definition: Enrolled for the number of hours or courses 
     the school considers full-time
   - Example: 22-year-old college student attending full semester (Aug-Dec) → Passes
   - Example: 23-year-old who attended part-time → Fails

3. **Permanently and Totally Disabled**: Person is permanently and totally 
   disabled, regardless of age
   - Definition: Unable to engage in substantial gainful activity due to 
     physical or mental condition
   - Condition must be expected to last continuously for at least a year or 
     result in death
   - Example: 30-year-old disabled son living with parents → Passes

**Additional Requirement**: The person must be younger than the taxpayer 
claiming them (or younger than taxpayer's spouse if filing jointly), UNLESS 
the person is permanently and totally disabled.

### Code Evidence
- Age calculated from `dateOfBirth` relative to last day of tax year
- Boolean flags: `isFullTimeStudent`, `isPermanentDisability`
- Test result stored in: `/familyAndHousehold/*/writableQcAgeTest`

### IRC Reference
Internal Revenue Code § 152(c)(3)
```

## Conclusion

Use this instruction set to systematically extract the complex, interconnected rules for dependent qualification. The goal is a specification that tax professionals can verify without reading code, capturing the full range of scenarios from straightforward qualifying children to complex tiebreaker situations.

Remember: These rules have major financial implications for taxpayers, so precision in specification is critical. Every "AND" vs "OR" matters.
