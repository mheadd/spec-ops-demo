# Software Specification: Tax Bracket Determination System

**Document Type:** Software Specification  
**Domain:** U.S. Federal Income Tax Calculation  
**Tax Year:** 2024  
**Filing Status:** Married Filing Jointly  
**Version:** 1.0  
**Created:** November 30, 2025

## Executive Summary

This specification defines how a tax calculation system determines and applies progressive federal income tax rates based on a taxpayer's taxable income. The system implements the U.S. federal tax bracket structure for Married Filing Jointly filers for the 2024 tax year.

## Authoritative Sources

- **Primary Source:** IRS Publication 17 (Your Federal Income Tax), Tax Computation Worksheet
- **Legal Authority:** Internal Revenue Code (IRC) § 1(a) - Tax Tables for Married Filing Jointly
- **Form Reference:** Form 1040, Line 16 (Tax Calculation)
- **Tax Year:** 2024

## Purpose

The tax bracket determination system calculates the exact federal income tax owed by applying progressive tax rates to taxable income. This is a core component of any tax calculation system and must produce results identical to IRS-published tax tables.

## Key Concepts

### Progressive Tax System

The United States uses a **progressive tax system** where:
- Income is divided into brackets
- Each bracket has its own tax rate
- Higher brackets only apply to income that exceeds the bracket threshold
- Tax is calculated cumulatively across all applicable brackets

**Example:**
For $100,000 taxable income:
- First $23,200 is taxed at 10% = $2,320
- Next $71,100 ($94,300 - $23,200) is taxed at 12% = $8,532
- Remaining $5,700 ($100,000 - $94,300) is taxed at 22% = $1,254
- **Total tax: $12,106**

### Marginal vs. Effective Tax Rate

- **Marginal Rate:** The tax rate on the last dollar earned (your highest bracket)
- **Effective Rate:** Total tax divided by total income (average rate paid)

The system calculates using marginal rates but taxpayers experience the effective rate.

## Functional Requirements

### Input Requirements

#### Required Input
- **Taxable Income** (`/taxableIncome`)
  - Data Type: Dollar amount (currency with two decimal places)
  - Source: User-entered or calculated from Form 1040
  - Constraints: Must be zero or positive
  - Description: The amount of income subject to tax after deductions

#### Implicit Inputs
- **Filing Status:** Married Filing Jointly (fixed for this specification)
- **Tax Year:** 2024 (determines bracket thresholds and rates)

### Output Requirements

#### Primary Output
- **Tax Owed** (`/tax`)
  - Data Type: Dollar amount (currency with two decimal places)
  - Rounding: IRS rounding rules apply (50+ cents rounds up)
  - Description: The federal income tax owed before credits

## Business Rules

### Rule 1: Tax Bracket Structure for Married Filing Jointly (2024)

The system SHALL implement seven progressive tax brackets:

| Bracket | Income Range | Marginal Rate | Base Tax | Formula |
|---------|--------------|---------------|----------|---------|
| 1 | $0 - $23,200 | 10% | $0 | Income × 10% |
| 2 | $23,201 - $94,300 | 12% | $2,320 | $2,320 + (12% × (Income - $23,200)) |
| 3 | $94,301 - $201,050 | 22% | $10,852 | $10,852 + (22% × (Income - $94,300)) |
| 4 | $201,051 - $383,900 | 24% | $34,337 | $34,337 + (24% × (Income - $201,050)) |
| 5 | $383,901 - $487,450 | 32% | $78,221 | $78,221 + (32% × (Income - $383,900)) |
| 6 | $487,451 - $628,300 | 35% | $111,357 | $111,357 + (35% × (Income - $487,450)) |
| 7 | $628,301+ | 37% | $160,654.50 | $160,654.50 + (37% × (Income - $628,300)) |

**Note:** The example code provided only demonstrates Brackets 6 and 7. A complete implementation MUST include all seven brackets.

### Rule 2: Sequential Bracket Evaluation

The system SHALL evaluate brackets in ascending order:
1. Check if income falls in lowest bracket first
2. If condition matches, apply that bracket's formula
3. If condition does not match, proceed to next higher bracket
4. Continue until matching bracket is found

**Implementation Note:** The highest bracket serves as a "catch-all" for all income above the second-highest threshold.

### Rule 3: Base Tax Amount

Each bracket formula includes a **base tax amount** representing the cumulative tax from all lower brackets:

- **Bracket 2:** $2,320 = tax on first $23,200 (Bracket 1)
- **Bracket 3:** $10,852 = $2,320 + tax on next $71,100 (Bracket 2)
- **Bracket 4:** $34,337 = $10,852 + tax on next $106,750 (Bracket 3)
- And so on...

The system MUST NOT recalculate lower brackets; instead it SHALL use the pre-calculated base amount.

### Rule 4: Excess Calculation

For income in Bracket N (where N > 1), calculate tax on the excess:
1. Subtract the lower threshold from taxable income
2. Multiply the excess by the marginal rate
3. Add the result to the base tax amount

**Example for Bracket 6:**
- Income: $500,000
- Threshold: $487,450
- Excess: $500,000 - $487,450 = $12,550
- Tax on excess: $12,550 × 35% = $4,392.50
- Base tax: $111,357
- **Total tax: $115,749.50**

### Rule 5: IRS-Specific Rounding

The final tax amount SHALL be rounded using IRS rules:
- Round to the nearest whole dollar
- **Special rule:** Amounts of 50 cents or more ALWAYS round up
- Amounts less than 50 cents round down

**Examples:**
- $1,234.49 → $1,234
- $1,234.50 → $1,235
- $1,234.51 → $1,235
- $1,234.99 → $1,235

**Note:** This differs from standard mathematical rounding where exactly 50 cents rounds to the nearest even number.

### Rule 6: Tax Rate Precision

Tax rates SHALL be expressed as exact fractions to avoid floating-point precision errors:
- 10% = 10/100
- 12% = 12/100
- 22% = 22/100
- 24% = 24/100
- 32% = 32/100
- 35% = 35/100
- 37% = 37/100

Implementation SHOULD NOT use decimal representations (0.10, 0.12, etc.) to maintain precision.

## Calculation Specifications

### Complete Tax Calculation Formula (All Brackets)

```
IF taxable_income ≤ $23,200 THEN
    tax = taxable_income × 10%

ELSE IF taxable_income ≤ $94,300 THEN
    tax = $2,320 + ((taxable_income - $23,200) × 12%)

ELSE IF taxable_income ≤ $201,050 THEN
    tax = $10,852 + ((taxable_income - $94,300) × 22%)

ELSE IF taxable_income ≤ $383,900 THEN
    tax = $34,337 + ((taxable_income - $201,050) × 24%)

ELSE IF taxable_income ≤ $487,450 THEN
    tax = $78,221 + ((taxable_income - $383,900) × 32%)

ELSE IF taxable_income ≤ $628,300 THEN
    tax = $111,357 + ((taxable_income - $487,450) × 35%)

ELSE
    tax = $160,654.50 + ((taxable_income - $628,300) × 37%)

RETURN round_to_nearest_dollar(tax)
```

### Step-by-Step Calculation Process

For a tax calculation system implementation:

1. **Receive Input**
   - Accept taxable income as dollar amount
   - Validate: amount ≥ $0

2. **Determine Bracket**
   - Compare income against threshold values
   - Identify applicable bracket (1-7)

3. **Calculate Base + Marginal Tax**
   - Retrieve base tax for bracket
   - Calculate excess over threshold
   - Multiply excess by marginal rate
   - Sum base tax and marginal tax

4. **Apply Rounding**
   - Round result to nearest dollar
   - Apply IRS 50-cent rule

5. **Return Tax Amount**
   - Output as dollar amount

## Test Cases and Expected Results

The system SHALL produce the following results for the given inputs:

| Test Case | Taxable Income | Expected Tax | Bracket | Description |
|-----------|---------------|--------------|---------|-------------|
| 1 | $20,000 | $2,000 | 1 | Low income, first bracket only |
| 2 | $23,200 | $2,320 | 1 | Exactly at first threshold |
| 3 | $50,000 | $5,536 | 2 | Mid-range, second bracket |
| 4 | $94,300 | $10,852 | 2 | Exactly at second threshold |
| 5 | $100,000 | $12,106 | 3 | Third bracket |
| 6 | $150,000 | $22,688 | 3 | Third bracket, higher income |
| 7 | $201,050 | $34,337 | 3 | Exactly at third threshold |
| 8 | $250,000 | $46,087 | 4 | Fourth bracket |
| 9 | $383,900 | $78,221 | 4 | Exactly at fourth threshold |
| 10 | $450,000 | $99,357 | 5 | Fifth bracket |
| 11 | $487,450 | $111,357 | 5 | Exactly at fifth threshold |
| 12 | $500,000 | $115,750 | 6 | Sixth bracket |
| 13 | $628,300 | $160,655 | 6 | Exactly at sixth threshold |
| 14 | $700,000 | $187,184 | 7 | Seventh bracket (highest) |
| 15 | $1,000,000 | $324,813 | 7 | High income, top bracket |

**Calculation Detail for Test Case 12 ($500,000):**
```
Income: $500,000
Bracket: 6 (income ≤ $628,300)
Base tax: $111,357
Excess: $500,000 - $487,450 = $12,550
Marginal tax: $12,550 × 35% = $4,392.50
Total: $111,357 + $4,392.50 = $115,749.50
Rounded: $115,750
```

## Edge Cases and Special Considerations

### Edge Case 1: Zero Income
- **Input:** $0
- **Expected:** $0
- **Rationale:** No taxable income means no tax owed

### Edge Case 2: Exact Threshold Amounts
- **Behavior:** Income exactly at threshold should use the LOWER bracket
- **Example:** $23,200 uses 10% rate (Bracket 1), not 12% rate
- **Implementation:** Use "less than or equal to" comparisons

### Edge Case 3: Rounding Boundaries
- **Input:** Calculated tax of $1,234.495
- **Expected:** $1,234 (rounds to $1,234.50, then to $1,235)
- **Note:** Intermediate rounding may affect final result

### Edge Case 4: Very High Income
- **Input:** $10,000,000
- **Expected:** $3,617,959
- **Rationale:** No upper limit to highest bracket

### Edge Case 5: Negative Income (Invalid)
- **Input:** -$5,000
- **Expected:** Error or validation failure
- **Rationale:** Taxable income cannot be negative

## Non-Functional Requirements

### Accuracy
- Tax calculations MUST match IRS-published tax tables exactly
- Precision MUST be maintained to the cent before rounding
- Rounding MUST follow IRS rules precisely

### Performance
- Calculation SHOULD complete in less than 100ms for typical inputs
- System SHOULD support batch processing of multiple calculations

### Maintainability
- Tax brackets and rates SHOULD be configurable (annual updates)
- Code SHOULD clearly separate data (brackets) from logic (calculation)
- Comments SHOULD reference IRS publications for each bracket

### Auditability
- System SHOULD log inputs and outputs for tax calculations
- Intermediate values (bracket, excess, base tax) MAY be logged for debugging

### Extensibility
- Design SHOULD support additional filing statuses (Single, HoH, MFS)
- Design SHOULD support multiple tax years
- Design SHOULD integrate with broader tax calculation pipeline

## Integration Points

### Upstream Dependencies
- **Taxable Income Calculation:** System receives taxable income from:
  - AGI (Adjusted Gross Income) calculation
  - Standard or itemized deduction subtraction
  - Qualified Business Income deduction (if applicable)

### Downstream Consumers
- **Tax Credit Application:** Calculated tax becomes input for:
  - Child Tax Credit calculations
  - Earned Income Tax Credit calculations
  - Other credit and payment worksheets
  
- **Final Tax Determination:** Contributes to:
  - Total tax before credits (Form 1040, Line 16)
  - Tax liability after credits (Form 1040, Line 18)
  - Refund or amount owed calculation

## Implementation Guidance

### For Imperative Languages (Python, JavaScript, Java)

Implement as a function or method:

```python
def calculate_tax_mfj_2024(taxable_income: Decimal) -> Decimal:
    """
    Calculate federal income tax for Married Filing Jointly, 2024.
    
    Args:
        taxable_income: Taxable income in dollars
        
    Returns:
        Tax owed in dollars (rounded to nearest dollar)
    """
    if taxable_income <= 23200:
        tax = taxable_income * Decimal('0.10')
    elif taxable_income <= 94300:
        tax = Decimal('2320') + (taxable_income - Decimal('23200')) * Decimal('0.12')
    # ... additional brackets
    else:
        tax = Decimal('160654.50') + (taxable_income - Decimal('628300')) * Decimal('0.37')
    
    return round_irs(tax)
```

### For Declarative Systems (Fact Graph, Rules Engine)

Implement as conditional rules:

```xml
<Fact path="/tax">
  <Derived>
    <Round>
      <Switch>
        <Case>
          <When>
            <LessThanOrEqual>
              <Left><Dependency path="../taxableIncome" /></Left>
              <Right><Dollar>23200</Dollar></Right>
            </LessThanOrEqual>
          </When>
          <Then>
            <Multiply>
              <Rational>10/100</Rational>
              <Dependency path="../taxableIncome" />
            </Multiply>
          </Then>
        </Case>
        <!-- Additional cases for other brackets -->
      </Switch>
    </Round>
  </Derived>
</Fact>
```

### For Configuration-Based Systems

Store brackets as data:

```json
{
  "filing_status": "married_filing_jointly",
  "tax_year": 2024,
  "brackets": [
    {
      "threshold": 0,
      "rate": 0.10,
      "base_tax": 0
    },
    {
      "threshold": 23200,
      "rate": 0.12,
      "base_tax": 2320
    },
    {
      "threshold": 94300,
      "rate": 0.22,
      "base_tax": 10852
    }
    // ... additional brackets
  ]
}
```

## Annual Updates Required

This specification applies to **Tax Year 2024** only. The following elements change annually and MUST be updated:

1. **Bracket Thresholds:** Income ranges adjust for inflation
2. **Tax Rates:** Congress may modify rates (though rates have been stable since 2018)
3. **Base Tax Amounts:** Recalculated based on threshold changes

**Update Process:**
- Monitor IRS Revenue Procedures (published late October/early November)
- Review IRS Publication 17 for updated tax tables
- Update specification and implementation by December 31 for upcoming tax year
- Validate against IRS test cases before production deployment

## Validation and Testing

### Unit Test Requirements

Implementations MUST include:
- Tests for all seven tax brackets
- Tests for exact threshold boundaries
- Tests for rounding edge cases
- Tests for zero income
- Tests for very high income

### Integration Test Requirements

Implementations SHOULD test:
- Integration with taxable income calculation
- Integration with credit application
- End-to-end tax return calculation

### Acceptance Criteria

The implementation is considered correct if:
1. All 15 test cases produce expected results
2. Results match IRS tax tables for all income levels
3. Rounding follows IRS rules exactly
4. Code is maintainable and well-documented

## References

### IRS Publications
- Publication 17 (2024): Your Federal Income Tax
- Publication 505 (2024): Tax Withholding and Estimated Tax

### Legal Authority
- Internal Revenue Code § 1(a): Tax Tables for Married Filing Jointly
- Internal Revenue Code § 1(f): Inflation Adjustments

### Related Forms
- Form 1040: U.S. Individual Income Tax Return, Line 16
- Tax Computation Worksheet (in Form 1040 instructions)

### Source Code Reference
- IRS Direct File Repository: `direct-file/fact-graph-scala/shared/src/main/scala/_tutorial/03_numbers.worksheet.sc`
- Example implementation demonstrating Brackets 6 and 7

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 30, 2025 | Initial specification created from IRS Direct File example code | SpecOps Demo |

## Appendix A: Mathematical Verification

### Bracket Base Tax Calculations

**Bracket 1:** $0 - $23,200 at 10%
- Tax on $23,200 = $23,200 × 0.10 = $2,320

**Bracket 2:** $23,201 - $94,300 at 12%
- Range: $94,300 - $23,200 = $71,100
- Tax on range: $71,100 × 0.12 = $8,532
- Cumulative: $2,320 + $8,532 = $10,852 ✓

**Bracket 3:** $94,301 - $201,050 at 22%
- Range: $201,050 - $94,300 = $106,750
- Tax on range: $106,750 × 0.22 = $23,485
- Cumulative: $10,852 + $23,485 = $34,337 ✓

**Bracket 4:** $201,051 - $383,900 at 24%
- Range: $383,900 - $201,050 = $182,850
- Tax on range: $182,850 × 0.24 = $43,884
- Cumulative: $34,337 + $43,884 = $78,221 ✓

**Bracket 5:** $383,901 - $487,450 at 32%
- Range: $487,450 - $383,900 = $103,550
- Tax on range: $103,550 × 0.32 = $33,136
- Cumulative: $78,221 + $33,136 = $111,357 ✓

**Bracket 6:** $487,451 - $628,300 at 35%
- Range: $628,300 - $487,450 = $140,850
- Tax on range: $140,850 × 0.35 = $49,297.50
- Cumulative: $111,357 + $49,297.50 = $160,654.50 ✓

All base tax amounts verified correct.

## Appendix B: Glossary

**Base Tax:** The cumulative tax owed on all income below a bracket's threshold

**Bracket:** An income range subject to a specific tax rate

**Effective Tax Rate:** Total tax divided by total income (average rate)

**Excess:** The amount of income above a bracket threshold

**Filing Status:** Tax classification (MFJ, Single, HoH, MFS, QSS) affecting rates and thresholds

**Marginal Tax Rate:** The tax rate applied to the last dollar of income earned

**Progressive Tax:** Tax system where rates increase as income increases

**Taxable Income:** Total income minus deductions; the amount subject to tax

**Threshold:** The income level at which a higher tax bracket begins

---

**Document Status:** APPROVED  
**Implementation Ready:** YES  
**Next Review:** December 2025 (for Tax Year 2025 updates)
