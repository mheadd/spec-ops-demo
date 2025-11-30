# Dependent Qualification Specification

## Overview
This specification outlines the business logic for determining if an individual qualifies as a dependent for U.S. federal income tax purposes. This determination is critical as it impacts filing status, tax credits (like the Child Tax Credit), and other tax benefits. The logic is derived from an analysis of test cases that implement rules based on IRS guidelines.

This document is intended for use by AI coding agents to generate a specific implementation of these rules.

## Qualifying Child Requirements

A person qualifies as a **qualifying child** if they pass ALL five of the following tests. The implementation logic combines the results of these five tests with a logical AND.

### 1. Relationship Test
The individual must have a specific relationship to the taxpayer.
- **Rule**: The person must be the taxpayer's son, daughter, stepchild, foster child, brother, sister, half-brother, half-sister, stepbrother, stepsister, or a descendant of any of them (for example, a grandchild, niece, or nephew).
- **Code Evidence**: The code checks if the `relationshipCategory` is `childOrDescendants` or `siblings`. An adopted child is treated as a biological child.

### 2. Age Test
The individual must meet certain age requirements.
- **Rule**: The person must be:
    1.  Under age 19 at the end of the tax year, OR
    2.  Under age 24 at the end of the tax year AND a full-time student for at least 5 months of the year, OR
    3.  Any age if permanently and totally disabled.
- **Code Evidence**: The logic is validated using `dateOfBirth` against the tax year end, and boolean flags `isFullTimeStudent` and `isPermanentDisability`.

### 3. Residency Test
The individual must have lived with the taxpayer for a specified amount of time.
- **Rule**: The person must have lived with the taxpayer for more than half of the tax year.
- **Exceptions**: Temporary absences for special circumstances such as school, vacation, medical care, or military service count as time lived at home.
- **Code Evidence**: The test passes if the `residencyDuration` enumeration is set to `moreThanSixMonths`.

### 4. Support Test
The individual must not have provided more than half of their own support.
- **Rule**: The person cannot have provided more than half of their own support for the tax year.
- **Code Evidence**: The test passes if the `ownSupport` boolean flag is `false`.

### 5. Joint Return Test
The individual generally cannot file a joint tax return with a spouse.
- **Rule**: The person cannot file a joint return for the year.
- **Exception**: The test passes if the person files a joint return only to claim a refund of withheld income tax or estimated tax paid, and neither the person nor their spouse had a separate filing requirement.
- **Code Evidence**: The test fails if `filingJointReturn` is true, but passes if `filingOnlyForRefund` is true.

## Qualifying Relative Requirements

A person who is not a qualifying child can still be a dependent if they meet the four tests for a **qualifying relative**. The provided code examples focus on Qualifying Child tests, so this section is based on the standard IRS rules outlined in the comprehension skill.

### 1. Not a Qualifying Child Test
The person cannot be the qualifying child of the taxpayer or any other taxpayer.

### 2. Member of Household or Relationship Test
The person must either live with the taxpayer all year as a member of the household or be related to the taxpayer in one of the specified ways (e.g., parent, grandparent, aunt, uncle).

### 3. Gross Income Test
The person's gross income for the tax year must be less than the exemption amount (e.g., $4,700 for 2023, adjusted for inflation).

### 4. Support Test
The taxpayer must provide more than half of the person's total support for the year.

## Tiebreaker Rules

When a child meets the qualifying child rules for more than one person, IRS tiebreaker rules determine who can claim the child.

1.  **Parent vs. Non-Parent**: If one person is the child's parent, the parent has priority.
2.  **Two Parents**: If the parents do not file a joint return, the child is the qualifying child of the parent with whom the child lived for the longer period of time during the year. If the time was equal, the parent with the higher Adjusted Gross Income (AGI) has priority.
3.  **Two Non-Parents**: If no parent can claim the child, the person with the highest AGI has priority.

- **Code Evidence**: The code includes a flag `isQualifyingChildOfAnother` which is set based on whether another person could claim the child and is required to file a tax return. This suggests the system disallows a claim if another taxpayer with a higher-priority claim exists and is filing.

## Impact on Tax Benefits

This dependency determination is a prerequisite for several major tax benefits, including but not limited to:
- Child Tax Credit (CTC) and Credit for Other Dependents (ODC)
- Head of Household filing status
- Earned Income Tax Credit (EITC)
- Child and Dependent Care Credit

## Implementation Notes

- The logic is implemented using a fact graph system where facts are represented as paths (e.g., `/familyAndHousehold/*/qualifyingChild`).
- Input data is provided through "writable" facts (e.g., `dateOfBirth`, `isFullTimeStudent`).
- The final determination `qualifyingChild` is a derived fact based on the logical AND of the five underlying test results (`qcRelationshipTest`, `writableQcAgeTest`, `qcResidencyTest`, `qcSupportTest`, `jointReturnTest`).
- The system uses enumerations for values with specific options, such as `residencyDuration` and `relationshipCategory`.
- The code is structured as a series of unit tests, with each test case verifying a specific condition or edge case of the dependency rules.
