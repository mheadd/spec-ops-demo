# Standard Deduction Specification

Tax Year: 2024  
Source Authority: IRS Publication 501; IRC § 63  
Related Forms: Form 1040 (line 12), Schedule 1

## Overview

This specification defines how a tax calculation system determines the standard deduction and any additional standard deduction amounts based on taxpayer attributes and filing status. It also defines reduced standard deduction rules for taxpayers who can be claimed as dependents and special rules for Married Filing Separately (MFS).

The specification is derived from analysis of IRS Direct File example tests and guided by the Tax Logic Comprehension and Standard Deduction Calculation skills.

## Base Standard Deduction Amounts (2024)

- Single: $14,600
- Married Filing Jointly (MFJ): $29,200
- Married Filing Separately (MFS): $14,600
- Head of Household (HoH): $21,900
- Qualifying Surviving Spouse (QSS): $29,200

Note: Amounts are adjusted annually. Systems must parameterize by tax year.

## Additional Standard Deduction Items

Additional deduction items increase the standard deduction by a per-item amount based on filing status. Each qualifying condition counts as one "item". Conditions include: age 65+ and blindness. MFJ evaluates each spouse separately.

### Per-Item Additional Amounts (2024)

- Single/HoH: $1,950 per item  
- MFJ/MFS/QSS: $1,550 per item

### Qualifying Conditions

1. Age 65 or Older by end of tax year
   - Use IRS Pub 501 "day-before-birthday" rule: A taxpayer is considered to reach age X on the day before their birthday. Example: born January 1, 1960 → considered 65 for tax year 2024.
2. Blindness  
   - Certified blindness per IRC § 63(f)(4).

### Stacking and Maximums

- A taxpayer can receive both age and blindness items.  
- MFJ: Both spouses evaluated independently; up to 4 items (2 conditions × 2 spouses).

### Computation

- Compute `additionalItems` as the count of qualifying conditions:
  - Primary filer: +1 if age 65+; +1 if blind  
  - Spouse (if applicable under filing status rules): +1 if age 65+; +1 if blind
- `additionalDeduction = additionalItems × perItemAmount[filingStatus]`

### Code Evidence

- Test: "additional items are zero if not blind or over 65"  
- Test: "adds an item if the filer is over 65"  
- Test: "adds an item if the filer is blind"  
- Test: "counts January 1 of the next year as 65"  
- Test: "Does not count January 2 of the next year as 65"

## Reduced Standard Deduction (Dependents)

When the taxpayer can be claimed as a dependent by another person, the standard deduction may be reduced.

### Calculation (2024)

`reducedStandardDeduction = max(1,300, earnedIncome + 450)`  
`finalStandardDeduction = min(reducedStandardDeduction, baseStandardDeduction[filingStatus])`

### Exception: Full Standard Deduction Allowed

If the potential claimer is NOT required to file, and the potential claimer did NOT file or filed ONLY to claim a refund, then the taxpayer may receive the full standard deduction despite being "claimable".

### Additional Items Still Apply

Dependents may still receive additional items (age/blindness) subject to eligibility.

### Code Evidence

- Test: "Receives normal standard deduction when filer cannot be claimed"  
- Test: "When filer can be claimed, receives lower standard deduction"  
- Fields: `canBeClaimed`, `potentialClaimerMustFile`

## Married Filing Separately (MFS) Special Rules

### Itemization Dependency

- If one MFS spouse itemizes, the other MFS spouse MUST itemize. In such a case, the standard deduction is not available.

### Claiming Spouse's Additional Items

An MFS filer may claim spouse’s additional items (age 65+, blindness) ONLY if ALL the following are true:

1. Spouse has NO gross income  
2. Spouse is NOT filing a return  
3. Spouse CANNOT be claimed as a dependent by someone else  
4. Filing status is MFS

If all conditions are met, add spouse’s applicable items to `additionalItems`.

### Code Evidence

- Test: "Adds an additional item for blindness if the spouse is blind with no income, isn't filing, and can't be claimed as a dependent"  
- Test: "Does not add an additional item for blindness if the spouse is blind but has income"

## Deceased Spouse Context (Informational)

Systems should support the general rule that if filing MFJ in the year of death, the deceased spouse’s age/blindness may count if met by date of death. While not directly evidenced in the provided test excerpt, incorporate per Pub 501 guidance where applicable.

## Algorithm Outline for Implementation

1. Determine `base = baseStandardDeduction[filingStatus][taxYear]`.
2. Initialize `additionalItems = 0`.
3. For primary filer:  
   - If age≥65 (with day-before-birthday rule), `additionalItems++`.  
   - If blind, `additionalItems++`.
4. If filing status allows spouse consideration (MFJ/QSS/MFS):  
   - For MFJ/QSS: evaluate spouse age/blindness, increment accordingly.  
   - For MFS: evaluate spouse age/blindness only if ALL four MFS conditions true; otherwise do not increment.
5. Compute `additionalAmount = additionalItems × perItemAmount[filingStatus][taxYear]`.
6. Determine dependent status reduction:  
   - If `canBeClaimed` is true and no exception applies, compute `reduced = max(1300, earnedIncome + 450)` then `base = min(reduced, base)`.
   - Else keep full base.
7. `standardDeduction = base + additionalAmount`.
8. If MFS and either spouse itemizes, enforce `standardDeduction = 0` (itemizers do not receive standard deduction).
9. Return `standardDeduction` with traceable decision log for compliance.

## Edge Cases to Handle

- January 1 birthday treated as reaching age (Pub 501)  
- January 2 birthday not treated as reaching age  
- Both spouses age 65+ and blind (MFJ): 4 items  
- Spouse blind but has income (MFS): no spouse additional  
- Dependent with minimal earned income: reduced deduction floors at $1,300

## Data Requirements

- Filing status: Single, MFJ, MFS, HoH, QSS  
- Tax year (for amount tables)  
- Primary filer: date of birth, blindness flag  
- Spouse: date of birth, blindness flag (if applicable)  
- Dependent status: `canBeClaimed`, `potentialClaimerMustFile`, `potentialClaimerDidFile`, `filedOnlyForRefund`  
- Earned income amount (for dependent reduction)  
- MFS spouse context: `MFSSpouseHasGrossIncome`, `MFSLivingSpouseFilingReturn`, `spouseCanBeClaimed`

## Validation Checklist

- [ ] Base amounts match tax year  
- [ ] Additional items computed correctly with stacking  
- [ ] Day-before-birthday rule applied  
- [ ] Dependent reduction formula and exception enforced  
- [ ] MFS spouse conditions respected (all-or-nothing)  
- [ ] Itemization dependency enforced for MFS  
- [ ] Outputs are traceable for audit and review

## Code References

- `examples/standard-deduction/standardDeduction.test.ts`  
- `examples/standard-deduction/README.md`

## Notes

- This specification should be considered tax-year dependent. Maintain an amount table per year and isolate behavioral rules that persist across years.
- AI coding agents should implement unit tests mirroring the example tests to ensure behavior alignment.
