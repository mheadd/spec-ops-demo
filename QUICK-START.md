# Quick Start Guide - SpecOps Demo

This guide helps you get started with the SpecOps demo for IRS Direct File.

## What We've Built

A demonstration repository showing how to develop **AI agent instruction sets** for analyzing tax system code and generating human-verifiable specifications.

## Repository Structure

```
spec-ops-demo/
├── README.md                          # Main project overview
├── QUICK-START.md                     # This file
│
├── skills/                            # AI agent instruction sets
│   ├── README.md                      # Skills overview
│   ├── tax-logic-comprehension.md     # Foundation skill for tax code analysis
│   └── standard-deduction-calculation.md  # Specialized standard deduction skill
│
├── examples/                          # Code samples from IRS Direct File
│   ├── standard-deduction/
│   │   ├── README.md
│   │   └── standardDeduction.test.ts  # Test cases showing deduction logic
│   ├── dependent-qualification/
│   │   ├── README.md
│   │   └── qualifying-child-sample.ts # Dependent determination logic
│   └── fact-graph-sample/
│       ├── README.md
│       └── tax-bracket-calculation.sc # Scala Fact Graph tax brackets
│
└── specifications/                    # (Empty - for generated specs)
```

## Three Ways to Use This Demo

### 1. Learn About SpecOps Methodology

**Read in this order:**

1. Main `README.md` - Project overview
2. `skills/README.md` - Understanding instruction sets
3. `examples/standard-deduction/README.md` - See real tax logic
4. `skills/tax-logic-comprehension.md` - How AI should analyze it

**Goal:** Understand how SpecOps preserves institutional knowledge

---

### 2. Develop New Instruction Sets

**Start here:**

1. Browse IRS Direct File to identify a tax concept
   - https://github.com/IRS-Public/direct-file
   - Look in `direct-file/df-client/df-client-app/src/test/factDictionaryTests/`

2. Extract code samples into `examples/[concept-name]/`
   - Include test files (best source of business rules)
   - Add README explaining what the code does

3. Create new skill in `skills/[concept-name].md`
   - Use `tax-logic-comprehension.md` as template
   - Focus on patterns specific to this concept
   - Include authoritative sources (IRS pubs)

4. Test the skill
   - Use AI agent with the skill to analyze your examples
   - Generate a specification
   - Refine skill based on results

**Candidates for new skills:**
- Dependent qualification rules
- Child Tax Credit (CTC) eligibility
- Earned Income Tax Credit (EITC) rules
- Head of Household (HoH) filing status
- Scala Fact Graph comprehension

---

### 3. Generate Specifications

**Using the existing skills:**

1. Choose a code sample from `examples/`

2. Load the appropriate skill:
   - Always start with `tax-logic-comprehension.md`
   - Add specialized skill if applicable

3. Prompt an AI agent (Claude, Copilot, etc.):
   ```
   Using the Tax Logic Comprehension skill and the Standard Deduction 
   Calculation skill, analyze the code in 
   examples/standard-deduction/standardDeduction.test.ts and generate 
   a plain-language specification that a tax policy expert could verify 
   against IRS Publication 501.
   ```

4. Review the generated specification:
   - Does it use plain language?
   - Are IRS publications referenced?
   - Are edge cases documented?
   - Could a tax expert verify this without reading code?

5. Refine and save to `specifications/`

---

## Key Concepts

### What is an Instruction Set (Skill)?

A detailed guide teaching AI agents how to:
- **Recognize** tax concepts in code
- **Extract** business rules
- **Document** in plain language
- **Reference** authoritative sources

Think of it as "training materials" for AI agents doing specific jobs.

### Why Not Just Use AI Directly?

Without instruction sets:
- ❌ AI describes code structure, not business rules
- ❌ AI uses technical jargon, not tax terminology
- ❌ AI doesn't cite authoritative sources
- ❌ Output varies wildly between requests

With instruction sets:
- ✅ Consistent output format
- ✅ Tax expert-friendly language
- ✅ IRS publication references
- ✅ Reusable across projects

### Why IRS Direct File?

It's perfect for demonstrating SpecOps because:
- ✅ **Public repository** - Anyone can access
- ✅ **Well-known** - High recognition value
- ✅ **Complex logic** - Real institutional knowledge
- ✅ **Domain expert verifiable** - Tax professionals can review specs
- ✅ **Modern codebase** - TypeScript, Scala, well-tested

## Example Workflow

### Scenario: Generate Standard Deduction Spec

**Step 1:** Read the context
```bash
cd /Users/markheadd/Repos/spec-ops-demo
cat examples/standard-deduction/README.md
```

**Step 2:** Load the skills in your AI tool
- Copy `skills/tax-logic-comprehension.md` content
- Copy `skills/standard-deduction-calculation.md` content
- Provide as context/instructions

**Step 3:** Provide the code
- Open `examples/standard-deduction/standardDeduction.test.ts`
- Share with AI agent

**Step 4:** Request specification
```
Using the Tax Logic Comprehension and Standard Deduction Calculation 
skills, analyze this test code and generate a specification document 
for the "Additional Standard Deduction for Age 65 or Older" rule.

Focus on:
1. The business rule in plain language
2. The "birthday rule" edge case
3. How it applies to different filing statuses
4. Reference to IRS Publication 501
```

**Step 5:** Review output
- Should read like a tax policy document
- Should cite IRS Pub 501
- Should explain the "day before birthday" rule
- Should note filing status variations

**Step 6:** Save specification
```bash
# Save to specifications/
specifications/standard-deduction-age-65-spec.md
```

## Testing Your Skills

### Good Specification Output Has:

- ✅ **Plain language** - "Taxpayers age 65 or older receive..." not "The factGraph checks if primaryFiler.age65OrOlder..."
- ✅ **Authority references** - "Per IRS Publication 501, Table 7..."
- ✅ **Tax year noted** - "For tax year 2024..."
- ✅ **Edge cases explained** - "Exception: Born January 1 counts as age 65 for prior year"
- ✅ **Complete context** - "This is 1 of 5 tests required for..."

### Poor Output Has:

- ❌ Code structure descriptions
- ❌ Technical implementation details
- ❌ Missing authoritative sources
- ❌ No edge case documentation
- ❌ Missing context

## Next Steps

### For Learning
1. Read through all READMEs in order
2. Study one complete skill (`standard-deduction-calculation.md`)
3. Review the code examples to see what skills help analyze

### For Contributing
1. Identify a new tax concept to document
2. Extract code samples from Direct File
3. Draft a new skill using existing ones as templates
4. Test by generating specifications

### For Production Use
1. Establish specification repository structure
2. Create project-specific skills
3. Set up review workflow with domain experts
4. Integrate into CI/CD for validation

## Common Questions

**Q: Can I use these skills with [AI tool]?**  
A: Yes! Skills are tool-agnostic. Copy the content into your tool's instructions/context.

**Q: Do I need to clone IRS Direct File repo?**  
A: No. We've extracted relevant samples. But you can browse it online for more examples.

**Q: Are these skills specific to Direct File?**  
A: No. They're designed to be **portable** - work with any tax system (state, federal, other countries).

**Q: How do I know if my skill is good?**  
A: Test it! Generate specs with it. Can a domain expert verify them without reading code?

**Q: Can I use this for non-tax systems?**  
A: Yes! The approach works for any domain with complex business rules and domain experts.

## Resources

- **SpecOps Methodology**: https://spec-ops.ai
- **IRS Direct File**: https://github.com/IRS-Public/direct-file
- **GitHub spec-kit**: https://github.com/github/spec-kit
- **SpecOps Repository**: https://github.com/mheadd/spec-ops

## Need Help?

- Review existing skills for patterns
- Check the examples for context
- Refer to SpecOps Core Tools documentation
- Open issues or discussions in the spec-ops repo

---

**Ready to start?** Pick one:
1. 📖 Read `skills/tax-logic-comprehension.md` to understand the foundation
2. 🔍 Browse `examples/` to see real code patterns
3. ✍️ Generate your first spec using existing skills
4. 🚀 Create a new skill for a different tax concept
