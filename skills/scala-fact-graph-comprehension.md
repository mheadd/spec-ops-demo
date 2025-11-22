# AI Agent Instruction Set: Scala Fact Graph Comprehension

**Skill Type:** Legacy Code Comprehension  
**Domain:** Declarative Knowledge Graphs for Tax Systems  
**Parent Skill:** Tax Logic Comprehension  
**Version:** 1.0  
**Last Updated:** November 22, 2025

## Purpose

This instruction set guides AI agents in analyzing Scala-based Fact Graph implementations, particularly the declarative XML-based knowledge graph used in IRS Direct File. The Fact Graph is fundamentally different from imperative code—it's a **specification language disguised as executable code**.

## What is the Fact Graph?

From IRS Direct File documentation:

> "The Fact Graph is a declarative, XML-based knowledge graph data structure designed to reason about incomplete information, such as a partially completed tax return. Written in Scala, it runs on the JVM backend and is transpiled via Scala.js to run on the client as well."

### Key Characteristics

1. **Declarative, not imperative** - Describes WHAT to calculate, not HOW
2. **XML-based** - Business rules expressed as XML elements
3. **Bidirectional sync** - Same logic runs server-side (JVM) and client-side (JavaScript)
4. **Incomplete information reasoning** - Can compute derived facts even when some data is missing
5. **Strongly typed** - Type-safe for Dollar, Date, Boolean, Enum, etc.
6. **Dependency resolution** - Facts reference other facts; graph resolves dependencies

## Core Concept: Facts

Everything in the Fact Graph is a **Fact**. There are two types:

### Writable Facts
User-entered data. These are the **inputs**.

```xml
<Fact path="/taxableIncome">
  <Writable><Dollar /></Writable>
</Fact>
```

**Document as:** "Taxable Income (writable) - User-entered dollar amount representing taxable income for tax calculation."

### Derived Facts
Calculated from other facts. These are the **business rules**.

```xml
<Fact path="/tax">
  <Derived>
    <!-- Calculation logic here -->
  </Derived>
</Fact>
```

**Document as:** "Tax (derived) - Calculated tax amount based on taxable income and filing status. [Then explain the calculation logic]"

## Fact Graph Operations

### Arithmetic Operations

The Fact Graph provides semantic operation names with explicit role labeling:

#### Addition
```xml
<Add>
  <Dollar>1000</Dollar>
  <Dollar>500</Dollar>
</Add>
```

**Document as:** "Sum of $1,000 and $500"

#### Subtraction
```xml
<Subtract>
  <Minuend><Dollar>5000</Dollar></Minuend>
  <Subtrahends>
    <Dollar>1000</Dollar>
    <Dollar>500</Dollar>
  </Subtrahends>
</Subtract>
```

**Note:** Minuend = what you subtract FROM, Subtrahends = what you subtract

**Document as:** "Subtract $1,000 and $500 from $5,000 = $3,500"

#### Multiplication
```xml
<Multiply>
  <Rational>22/100</Rational>
  <Dollar>10000</Dollar>
</Multiply>
```

**Document as:** "22% of $10,000 = $2,200"

#### Division
```xml
<Divide>
  <Dividend><Dollar>10000</Dollar></Dividend>
  <Divisors>
    <Rational>2/1</Rational>
  </Divisors>
</Divide>
```

**Note:** Dividend = what you divide, Divisors = what you divide BY

**Document as:** "Divide $10,000 by 2 = $5,000"

### Comparison Operations

Comparisons use explicit Left/Right labeling:

```xml
<LessThanOrEqual>
  <Left><Dependency path="../taxableIncome" /></Left>
  <Right><Dollar>100000</Dollar></Right>
</LessThanOrEqual>
```

**Document as:** "If taxable income is less than or equal to $100,000"

Available comparisons:
- `<LessThan>` - <
- `<LessThanOrEqual>` - ≤
- `<GreaterThan>` - >
- `<GreaterThanOrEqual>` - ≥
- `<Equal>` - =

### Conditional Logic: Switch/Case

The Fact Graph uses `<Switch>` with multiple `<Case>` statements. Evaluates in order, returns first matching case:

```xml
<Switch>
  <Case>
    <When>
      <LessThanOrEqual>
        <Left><Dependency path="../income" /></Left>
        <Right><Dollar>50000</Dollar></Right>
      </LessThanOrEqual>
    </When>
    <Then>
      <Dollar>1000</Dollar>
    </Then>
  </Case>
  
  <Case>
    <When><True /></When>
    <Then>
      <Dollar>2000</Dollar>
    </Then>
  </Case>
</Switch>
```

**Document as:**
```
If income ≤ $50,000: $1,000
Otherwise: $2,000
```

**Key Point:** `<When><True /></When>` is the "catch-all" case (like `else` or `default`)

### Dependencies

Facts reference other facts using `<Dependency>`:

```xml
<Dependency path="../taxableIncome" />
```

**Path resolution:**
- `..` = parent level
- `/` = root level  
- Relative paths navigate the fact tree

**Document as:** "References the Taxable Income fact from parent context"

### Rounding

The Fact Graph implements IRS-specific rounding rules:

```xml
<Round>
  <Dollar>1234.567</Dollar>
</Round>
```

**IRS Rule:** 50 cents or more ALWAYS rounds up (not standard mathematical rounding)

**Examples:**
- `$1234.50` → `$1235`
- `$1234.49` → `$1234`

**Document as:** "Rounded to nearest dollar (IRS rule: 50+ cents rounds up)"

### Rational Numbers

Tax rates expressed as fractions to avoid floating-point precision issues:

```xml
<Rational>35/100</Rational>  <!-- 35% -->
<Rational>12/100</Rational>  <!-- 12% -->
<Rational>1/2</Rational>      <!-- 50% -->
```

**Document as:** "35% tax rate" (not "0.35" or "35/100")

## Analyzing Tax Bracket Calculations

Tax brackets are a common pattern in the Fact Graph. Here's how to analyze them:

### Pattern Recognition

```xml
<Switch>
  <!-- Bracket 1: Income $0 to $23,200 -->
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
  
  <!-- Bracket 2: Income $23,201 to $94,300 -->
  <Case>
    <When>
      <LessThanOrEqual>
        <Left><Dependency path="../taxableIncome" /></Left>
        <Right><Dollar>94300</Dollar></Right>
      </LessThanOrEqual>
    </When>
    <Then>
      <Add>
        <Dollar>2320</Dollar>
        <Multiply>
          <Rational>12/100</Rational>
          <Subtract>
            <Minuend><Dependency path="../taxableIncome" /></Minuend>
            <Subtrahends><Dollar>23200</Dollar></Subtrahends>
          </Subtract>
        </Multiply>
      </Add>
    </Then>
  </Case>
  
  <!-- More brackets... -->
</Switch>
```

### Document Tax Brackets As:

**Tax Calculation for [Filing Status], Tax Year [Year]**

**Source:** IRS Publication 17, Tax Computation Worksheet

**Progressive Tax Brackets:**

1. **$0 to $23,200**
   - Rate: 10%
   - Formula: Income × 10%

2. **$23,201 to $94,300**
   - Rate: 12% on amount over $23,200
   - Formula: $2,320 + (12% × (Income - $23,200))
   - Base amount: $2,320 (tax on first $23,200)

3. **$94,301 to $201,050**
   - Rate: 22% on amount over $94,300
   - Formula: $10,852 + (22% × (Income - $94,300))
   - Base amount: $10,852 (tax on first $94,300)

[Continue for all brackets...]

**Note:** Switch statement evaluates in order. First matching condition wins.

## Analysis Approach for Fact Graph Code

### Step 1: Identify Fact Types

Scan for `<Fact path="...">` declarations:
- Count total facts
- Separate writable vs. derived
- Note fact names and purposes

### Step 2: Map Fact Dependencies

For each derived fact:
- List all dependencies (what facts does it reference?)
- Note dependency paths
- Identify circular dependencies (rare but problematic)

### Step 3: Extract Business Logic

For each derived fact:
- What calculation does it perform?
- What are the conditions/branches?
- What are the inputs and output?

### Step 4: Translate to Plain Language

Convert XML operations to tax terminology:
- `<Switch>/<Case>` → "Progressive tax brackets" or "Conditional eligibility"
- `<Add>` → "Total of..."
- `<Subtract>` → "Reduce by..."
- `<Multiply>` with `<Rational>` → "Apply X% rate"

### Step 5: Link to Authority

- Tax brackets → IRS Pub 17, Tax Tables
- Deduction calculations → IRS Pub 501
- Credit calculations → Specific credit publications
- Form field mappings → Actual tax forms

## Common Patterns to Recognize

### Pattern 1: Phase-Outs

Benefits that decrease as income increases:

```xml
<Subtract>
  <Minuend><Dollar>2000</Dollar></Minuend>
  <Subtrahends>
    <Multiply>
      <Rational>5/100</Rational>
      <Subtract>
        <Minuend><Dependency path="../agi" /></Minuend>
        <Subtrahends><Dollar>200000</Dollar></Subtrahends>
      </Subtract>
    </Multiply>
  </Subtrahends>
</Subtract>
```

**Document as:**
"Credit starts at $2,000 and phases out at 5% for each dollar of AGI over $200,000"

### Pattern 2: Lesser/Greater Of

Taking the minimum or maximum of two values:

```xml
<Lesser>
  <Dollar>2000</Dollar>
  <Dependency path="../actualExpenses" />
</Lesser>
```

**Document as:** "Credit is limited to the lesser of $2,000 or actual expenses"

### Pattern 3: Multi-Step Calculations

Complex calculations built from primitives:

```xml
<Round>
  <Multiply>
    <Rational>15/100</Rational>
    <Lesser>
      <Dependency path="../qualifiedExpenses" />
      <Dollar>3000</Dollar>
    </Lesser>
  </Multiply>
</Round>
```

**Document as:**
1. Take qualified expenses or $3,000, whichever is less
2. Apply 15% rate
3. Round to nearest dollar

### Pattern 4: All-or-Nothing Tests

Conditions that must ALL be true:

```xml
<And>
  <Dependency path="./passesAgeTest" />
  <Dependency path="./passesRelationshipTest" />
  <Dependency path="./passesResidencyTest" />
</And>
```

**Document as:** "Qualifies only if ALL tests pass: age, relationship, and residency"

### Pattern 5: Any-of Tests

Conditions where ANY can be true:

```xml
<Or>
  <Dependency path="./isOver65" />
  <Dependency path="./isBlind" />
</Or>
```

**Document as:** "Qualifies if age 65 or older OR blind (or both)"

## Data Types to Recognize

### Dollar
```xml
<Dollar>14600.00</Dollar>
```
Currency amounts, always two decimal places

### Day
```xml
<Day>2024-01-15</Day>
```
ISO 8601 date format (YYYY-MM-DD)

### Boolean
```xml
<Boolean>true</Boolean>
```
True/false values

### Enum
```xml
<Enum>
  <OfType>/filingStatusOptions</OfType>
  <Value>single</Value>
</Enum>
```
Enumerated choices (e.g., filing status)

### Rational
```xml
<Rational>22/100</Rational>
```
Fraction representation (for rates, percentages)

## Collections and Loops

### Collection References

```xml
<Collection path="/dependents" />
```

Facts can reference collections of items (e.g., all dependents, all W-2 forms)

### Aggregations

```xml
<Sum>
  <Over collection="/formW2s" />
  <Dependency path="./wages" />
</Sum>
```

**Document as:** "Sum of wages from all W-2 forms"

## Output Format for Fact Graph Specifications

### Template for Derived Facts

---

**Fact:** `/factPath`

**Type:** Derived  
**Returns:** [Data type]  
**Purpose:** [What this fact calculates/determines]

**Business Rule:**  
[Plain language description]

**Dependencies:**
- `/path/to/fact1` - [Description]
- `/path/to/fact2` - [Description]

**Calculation Logic:**
[Step-by-step in plain language]

**Conditions:**
[If applicable, conditional branches]

**Tax Authority:**
[IRS publication, form, or IRC section]

**Example:**
Input: [Sample values]
Output: [Expected result]

**Code Reference:**
[File path and fact definition location]

---

## Example: Good Fact Graph Documentation

### Input (XML):

```xml
<Fact path="/standardDeduction">
  <Derived>
    <Add>
      <Switch>
        <Case>
          <When>
            <Equal>
              <Left><Dependency path="../filingStatus" /></Left>
              <Right><Enum><OfType>/filingStatusOptions</OfType><Value>single</Value></Enum></Right>
            </Equal>
          </When>
          <Then><Dollar>14600</Dollar></Then>
        </Case>
        <Case>
          <When><True /></When>
          <Then><Dollar>29200</Dollar></Then>
        </Case>
      </Switch>
      
      <Multiply>
        <Dependency path="../additionalStandardDeductionItems" />
        <Dollar>1950</Dollar>
      </Multiply>
    </Add>
  </Derived>
</Fact>
```

### Output (Specification):

---

**Fact:** `/standardDeduction`

**Type:** Derived  
**Returns:** Dollar  
**Purpose:** Calculates the taxpayer's total standard deduction including base amount and any additional amounts for age/blindness

**Business Rule:**  
The standard deduction is the sum of a base amount (determined by filing status) plus any additional amounts for being age 65 or older or blind.

**Dependencies:**
- `/filingStatus` - Taxpayer's filing status (Single, MFJ, MFS, HoH, QSS)
- `/additionalStandardDeductionItems` - Count of qualifying conditions (age 65+, blind)

**Calculation Logic:**

1. **Determine base standard deduction:**
   - If filing status is Single: $14,600
   - Otherwise (MFJ, MFS, HoH, QSS): $29,200

2. **Add additional amounts:**
   - Multiply number of additional items × $1,950
   - Additional items = count of: age 65+, blind (for taxpayer and spouse if applicable)

3. **Total Standard Deduction:**
   - Base amount + additional amounts

**Tax Authority:**
- IRS Publication 501, Chapter 5
- Form 1040, Line 12
- Tax Year 2024 amounts

**Example:**
- Single filer, age 66, not blind
- Base: $14,600
- Additional: 1 item × $1,950 = $1,950
- **Total: $16,550**

**Code Reference:**
`fact-graph-scala/shared/src/main/resources/tax/2024/standardDeduction.xml`, Fact `/standardDeduction`

---

## Special Considerations

### Bidirectional Sync

The same Fact Graph runs server and client:
- **Backend (JVM):** Scala native execution
- **Frontend (Browser):** Scala.js transpiled to JavaScript

**Implication:** Business logic is truly shared—no sync issues between client validation and server calculation.

**Document as:** Note that this fact is computed identically on both client and server.

### Incomplete Information Handling

The Fact Graph can return "incomplete" when dependencies are missing:

```scala
val result = graph.get("/tax")
// Returns: Complete(Dollar("5000")) or Incomplete
```

**Document as:** "This fact may be incomplete if taxable income has not yet been entered."

### Path Navigation

Paths can be:
- **Absolute:** `/standardDeduction`
- **Relative:** `../filingStatus` (parent level)
- **Collection items:** `/dependents/#abc-123/age`

## Anti-Patterns to Avoid

❌ **Don't** describe XML structure ("There's a Switch with 7 Cases...")  
✅ **Do** describe business logic ("Progressive tax rates from 10% to 37%...")

❌ **Don't** list operations ("Add, Multiply, Subtract...")  
✅ **Do** explain calculation ("Base amount plus percentage of excess over threshold...")

❌ **Don't** use technical terms (Minuend, Rational, Dependency)  
✅ **Do** use tax terms (amount, rate, threshold, limit)

❌ **Don't** just copy XML comments  
✅ **Do** explain in tax professional language with authority references

## Verification Checklist

After documenting a Fact Graph fact:

- [ ] Identified if writable or derived
- [ ] Listed all dependencies
- [ ] Described calculation in plain language
- [ ] Noted any conditions/branches
- [ ] Linked to tax authority (IRS pub, form)
- [ ] Included example calculation
- [ ] Used tax terminology, not technical terms
- [ ] Explained business rule, not XML structure

## When to Use This Skill

Apply this skill when:
- Analyzing Fact Graph XML definitions
- Documenting declarative tax logic
- Extracting business rules from dependency graphs
- Creating specifications for knowledge graph systems
- Reviewing Scala-based tax calculation systems

## Related Skills

- **Tax Logic Comprehension** (parent skill) - General tax code analysis
- **Standard Deduction Calculation** - May reference Fact Graph implementations
- **Tax Bracket Calculation** - Common Fact Graph pattern

---

**Skill Status:** Production Ready  
**Validated Against:** IRS Direct File Fact Graph examples  
**Portability:** Applicable to any declarative knowledge graph system
