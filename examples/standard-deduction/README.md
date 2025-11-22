# Standard Deduction Logic Examples

This directory contains code samples from IRS Direct File demonstrating standard deduction calculation logic.

## Source

Extracted from: https://github.com/IRS-Public/direct-file

## What This Code Does

The standard deduction calculation in tax law is complex and depends on multiple factors:

1. **Base standard deduction** - Varies by filing status (Single, Married Filing Jointly, Head of Household, etc.)
2. **Additional deduction items** - Taxpayers get additional amounts if they are:
   - Age 65 or older by end of tax year (or by January 1 of following year)
   - Blind
3. **Reduced standard deduction** - If a taxpayer can be claimed as a dependent by someone else
4. **Special rules** for Married Filing Separately (MFS) filers

## Key Business Rules Demonstrated

From IRS Publication 501:
- A taxpayer's birthday is considered the **day before** their actual birthday for tax purposes
- Someone turning 65 on January 1, 2025 is considered 65 for tax year 2024
- MFS filers can claim additional items for their spouse under specific conditions

## Files in This Example

- `standardDeduction.test.ts` - Test cases showing various standard deduction scenarios
- `standard-deduction-intro.tsx` - UI flow for standard deduction interview
- `README.md` - This file

## Why This Matters for Spec Ops

This is **institutional knowledge** that needs to be preserved:
- Complex age calculation rules
- Filing status interactions  
- Edge cases (deceased spouse, blind spouse not living with filer, etc.)
- The logic is spread across test files, fact dictionary definitions, and UI flows

A tax policy expert needs to verify these rules are correct, but they can't read TypeScript. Spec Ops would capture this as a plain-language specification.
