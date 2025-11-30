# Dependent Qualification Logic Examples

This directory contains code samples from IRS Direct File demonstrating dependent qualification rules.

## Source

Extracted from: https://github.com/IRS-Public/direct-file

## What This Code Does

Determining who qualifies as a dependent is one of the most complex areas of tax law. There are two types of dependents:

### 1. Qualifying Child (QC)
Must meet ALL of these tests:
- **Relationship test** - Child, stepchild, foster child, sibling, or descendant
- **Age test** - Under 19, or under 24 if full-time student, or any age if permanently disabled
- **Residency test** - Lived with taxpayer more than half the year
- **Support test** - Did not provide more than half of own support
- **Joint return test** - Not filing a joint return (with exceptions)

### 2. Qualifying Relative (QR)
Must meet ALL of these tests:
- **Not a qualifying child test** - Cannot be anyone's qualifying child
- **Member of household or relationship test** - Lived with taxpayer all year OR is a relative
- **Gross income test** - Income less than exemption amount ($5,050 for 2024)
- **Support test** - Taxpayer provided more than half of support

## Additional Complications

A person can also be:
- **Head of Household (HoH) Qualifying Person** - Special rules for filing status
- **Qualifying Surviving Spouse (QSS) person** - Related to deceased spouse
- **Child Tax Credit (CTC) eligible** - Must be under 17 with SSN
- **Other Dependent Credit (ODC) eligible** - For dependents who don't qualify for CTC
- **EITC Qualifying Child** - Similar to QC but with variations
- **CDCC (Child and Dependent Care Credit) Qualifying Person** - Can be dependent or non-dependent

## Key Edge Cases Demonstrated

1. **"Qualifying child of another"** - Tiebreaker rules when multiple people can claim same child
2. **Birthday rules** - Same "day before" rule as standard deduction
3. **Parent custody rules** - Special rules for separated/divorced parents
4. **Student status** - Full-time student affects age test
5. **Unable to care for self** - Permanent disability exception

## Files in This Example

- `dependents.test.ts` - Test cases for dependent qualification logic
- `qualifying-child-sample.ts` - Code showing QC determination
- `README.md` - This file

## Why This Matters for Spec Ops

This represents **critical institutional knowledge**:
- Over 2,400 lines of test code covering edge cases
- Multiple interconnected business rules
- References to IRS publications (501, 502, 503, etc.)
- Logic that impacts multiple tax benefits (CTC, EITC, HoH, etc.)

Tax policy experts need to verify these rules match IRS guidance, but the complexity makes code review impossible. Spec Ops would extract this into verifiable specifications organized by:
- Test type (Relationship, Age, Residency, Support, Joint Return)
- Dependent type (QC vs QR)
- Benefit type (CTC, EITC, HoH, etc.)