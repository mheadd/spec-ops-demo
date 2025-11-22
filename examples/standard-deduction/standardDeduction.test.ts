// Excerpt from: https://github.com/IRS-Public/direct-file
// File: direct-file/df-client/df-client-app/src/test/factDictionaryTests/standardDeduction.test.ts
// This demonstrates test cases for standard deduction calculation logic

import { describe, it, expect } from 'vitest';
import { ConcretePath } from '@irs/js-factgraph-scala';
import { CURRENT_TAX_YEAR } from '../../constants/taxConstants.js';

export const primaryFilerId = `959c03d1-af4a-447f-96aa-d19397048a44`;
export const spouseId = `859c03d1-af4a-447f-96aa-d19397048a48`;

const birthYearIfTurnedXInTaxYear = (x: number): number => parseInt(CURRENT_TAX_YEAR) - x;

describe(`Reduced Standard Deduction`, () => {
  const singleFilerData = {
    [`/filers/#${primaryFilerId}/firstName`]: createStringWrapper(`Test`),
    '/filers': createCollectionWrapper([primaryFilerId, spouseId]),
    [`/filers/#${primaryFilerId}/dateOfBirth`]: createDayWrapper(`1987-01-01`),
    [`/filers/#${primaryFilerId}/isBlind`]: createBooleanWrapper(false),
    [`/filers/#${primaryFilerId}/isPrimaryFiler`]: createBooleanWrapper(true),
    '/maritalStatus': createEnumWrapper(`single`, `/maritalStatusOptions`),
    '/filingStatus': createEnumWrapper(`single`, `/filingStatusOptions`),
  };

  it(`Receives the normal standard deduction when the filer cannot be claimed`, ({ task }) => {
    task.meta.testedFactPaths = [`/standardDeduction`];
    const { factGraph } = setupFactGraph({
      ...singleFilerData,
      ...{ [`/filers/#${primaryFilerId}/canBeClaimed`]: createBooleanWrapper(false) },
    });
    // Normal standard deduction for 2024= $14,600
    expect(factGraph.get(`/standardDeduction` as ConcretePath).get.toString()).toBe(`14600.00`);
  });

  it(`When the filer can be claimed, receives lower standard deduction`, ({ task }) => {
    task.meta.testedFactPaths = [`/standardDeduction`];
    const { factGraph: mustFileFactGraph } = setupFactGraph({
      ...singleFilerData,
      ...{
        [`/filers/#${primaryFilerId}/canBeClaimed`]: createBooleanWrapper(true),
        [`/filers/#${primaryFilerId}/potentialClaimerMustFile`]: createBooleanWrapper(true),
      },
    });
    expect(mustFileFactGraph.get(`/standardDeduction` as ConcretePath).get.toString()).toBe(`1300.00`);
  });
});

describe(`Standard deduction additional items`, () => {
  describe(`For a single filer`, () => {
    it(`additional items are zero if not blind or over 65`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      const { factGraph } = setupFactGraph(singleFilerData);
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(0);
    });

    it(`adds an item if the filer is over 65`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      const yob = birthYearIfTurnedXInTaxYear(66);
      const { factGraph } = setupFactGraph({
        ...singleFilerData,
        [`/filers/#${primaryFilerId}/dateOfBirth`]: createDayWrapper(`${yob}-06-06`),
      });
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(1);
    });

    it(`adds an item if the filer is blind`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      const { factGraph } = setupFactGraph({
        ...singleFilerData,
        [`/filers/#${primaryFilerId}/isBlind`]: createBooleanWrapper(true),
      });
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(1);
    });

    it(`counts January 1 of the next year as 65`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      // Pub 501 defines a person's birthday as the day before their birthday.
      // so if you turn 65 on January 1 of the following tax year, you receive an additional item
      const yob = birthYearIfTurnedXInTaxYear(64);
      const { factGraph } = setupFactGraph({
        ...singleFilerData,
        [`/filers/#${primaryFilerId}/dateOfBirth`]: createDayWrapper(`${yob}-01-01`),
      });
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(1);
    });

    it(`Does not count January 2 of the next year as 65`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      const yob = birthYearIfTurnedXInTaxYear(64);
      const { factGraph } = setupFactGraph({
        ...singleFilerData,
        [`/filers/#${primaryFilerId}/dateOfBirth`]: createDayWrapper(`${yob}-01-02`),
      });
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(0);
    });
  });

  describe(`For an MFJ filer`, () => {
    it(`Provides 4 deduction items if both the TP and Spouse are over 65 and blind`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      const yob = birthYearIfTurnedXInTaxYear(65);
      const { factGraph } = setupFactGraph({
        ...mfjFilerData,
        ...{
          [`/filers/#${spouseId}/dateOfBirth`]: createDayWrapper(`${yob}-06-06`),
          [`/filers/#${primaryFilerId}/dateOfBirth`]: createDayWrapper(`${yob}-06-06`),
          [`/filers/#${primaryFilerId}/isBlind`]: createBooleanWrapper(true),
          [`/filers/#${spouseId}/isBlind`]: createBooleanWrapper(true),
        },
      });
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(4);
    });
  });

  describe(`For an MFS filer`, () => {
    it(`Adds an additional item for blindness if the spouse is blind with no income,
        isn't filing, and can't be claimed as a dependent`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      const { factGraph } = setupFactGraph({
        ...mfsFilerData,
        ...{
          [`/filers/#${spouseId}/isBlind`]: createBooleanWrapper(true),
          [`/MFSSpouse65OrOlder`]: createBooleanWrapper(false),
          [`/MFSSpouseHasGrossIncome`]: createBooleanWrapper(false),
          [`/MFSLivingSpouseFilingReturn`]: createBooleanWrapper(false),
          [`/filers/#${spouseId}/canBeClaimed`]: createBooleanWrapper(false),
        },
      });
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(1);
    });

    it(`Does not add an additional item for blindness if the spouse is blind but has income`, ({ task }) => {
      task.meta.testedFactPaths = [`/additionalStandardDeductionItems`];
      const { factGraph } = setupFactGraph({
        ...mfsFilerData,
        ...{
          [`/filers/#${spouseId}/isBlind`]: createBooleanWrapper(true),
          [`/MFSSpouseHasGrossIncome`]: createBooleanWrapper(true),
          [`/MFSLivingSpouseFilingReturn`]: createBooleanWrapper(false),
          [`/filers/#${spouseId}/canBeClaimed`]: createBooleanWrapper(false),
        },
      });
      expect(factGraph.get(`/additionalStandardDeductionItems` as ConcretePath).get).toBe(0);
    });
  });
});
