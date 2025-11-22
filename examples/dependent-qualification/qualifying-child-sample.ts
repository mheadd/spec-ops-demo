// Excerpt from: https://github.com/IRS-Public/direct-file
// File: direct-file/df-client/df-client-app/src/test/factDictionaryTests/dependents.test.ts
// This demonstrates test cases for qualifying child determination

import { describe, it, expect } from 'vitest';
import { Path } from '../flow/Path.js';

const childId = `child-test-id`;

// Sample test data setup
const biologicalChildBaseData = {
  ...childBaseData,
  [`/familyAndHousehold/#${childId}/relationshipCategory`]: createEnumWrapper(
    `childOrDescendants`,
    `/relationshipCategoryOptions`
  ),
  [`/familyAndHousehold/#${childId}/childRelationship`]: createEnumWrapper(
    `biologicalChild`,
    `/childRelationshipOptions`
  ),
};

// Data for a person who meets qualifying child criteria
const qcData = {
  [`/familyAndHousehold/#${childId}/residencyDuration`]: createEnumWrapper(
    `moreThanSixMonths`,
    `/residencyDurationOptions`
  ),
  [`/familyAndHousehold/#${childId}/biologicalOrAdoptiveParentsLiving`]: createBooleanWrapper(false),
  [`/familyAndHousehold/#${childId}/tpClaims`]: createBooleanWrapper(true),
  [`/familyAndHousehold/#${childId}/writableQcAgeTest`]: createBooleanWrapper(true),
};

describe(`Qualifying Child Tests`, () => {
  describe(`Relationship Test`, () => {
    it(`Is a qualifying child if they are your biological child`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qcRelationshipTest`, childId)).get).toBe(true);
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(true);
    });

    it(`Is not a qualifying child if they are unrelated`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...unrelatedChildBaseData,
        ...qcData,
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qcRelationshipTest`, childId)).get).toBe(false);
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(false);
    });
  });

  describe(`Age Test`, () => {
    it(`Passes age test if under 19 at end of tax year`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const dob = `${CURRENT_TAX_YEAR_AS_NUMBER - 18}-12-31`;
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/dateOfBirth`]: createDayWrapper(dob),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(true);
    });

    it(`Fails age test if 19 or older (unless student or disabled)`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const dob = `${CURRENT_TAX_YEAR_AS_NUMBER - 19}-12-31`;
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/dateOfBirth`]: createDayWrapper(dob),
        [`/familyAndHousehold/#${childId}/isFullTimeStudent`]: createBooleanWrapper(false),
        [`/familyAndHousehold/#${childId}/hasDisability`]: createBooleanWrapper(false),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/writableQcAgeTest`, childId)).get).toBe(false);
    });

    it(`Passes age test if under 24 and full-time student`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const dob = `${CURRENT_TAX_YEAR_AS_NUMBER - 23}-12-31`;
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/dateOfBirth`]: createDayWrapper(dob),
        [`/familyAndHousehold/#${childId}/isFullTimeStudent`]: createBooleanWrapper(true),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(true);
    });

    it(`Passes age test at any age if permanently disabled`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const dob = `${CURRENT_TAX_YEAR_AS_NUMBER - 30}-01-01`;
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/dateOfBirth`]: createDayWrapper(dob),
        [`/familyAndHousehold/#${childId}/hasDisability`]: createBooleanWrapper(true),
        [`/familyAndHousehold/#${childId}/isPermanentDisability`]: createBooleanWrapper(true),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(true);
    });
  });

  describe(`Residency Test`, () => {
    it(`Passes residency test if lived with taxpayer more than half the year`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/residencyDuration`]: createEnumWrapper(
          `moreThanSixMonths`,
          `/residencyDurationOptions`
        ),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(true);
    });

    it(`Fails residency test if lived with taxpayer less than half the year`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/residencyDuration`]: createEnumWrapper(
          `lessThanSixMonths`,
          `/residencyDurationOptions`
        ),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qcResidencyTest`, childId)).get).toBe(false);
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(false);
    });
  });

  describe(`Support Test`, () => {
    it(`Passes support test if dependent did not provide more than half own support`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/ownSupport`]: createBooleanWrapper(false),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(true);
    });

    it(`Fails support test if dependent provided more than half own support`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/ownSupport`]: createBooleanWrapper(true),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qcSupportTest`, childId)).get).toBe(false);
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(false);
    });
  });

  describe(`Joint Return Test`, () => {
    it(`Fails joint return test if married and filing joint return (with exceptions)`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/maritalStatus`]: createEnumWrapper(
          `married`,
          `/maritalStatusOptions`
        ),
        [`/familyAndHousehold/#${childId}/filingJointReturn`]: createBooleanWrapper(true),
        [`/familyAndHousehold/#${childId}/spouseFilingRequirement`]: createEnumWrapper(
          `required`,
          `/filingRequirementOptions`
        ),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/jointReturnTest`, childId)).get).toBe(false);
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(false);
    });

    it(`Passes joint return test if filing joint only to claim refund`, ({ task }) => {
      task.meta.testedFactPaths = [`/familyAndHousehold/*/qualifyingChild`];
      const { factGraph } = setupFactGraphDeprecated({
        ...biologicalChildBaseData,
        ...qcData,
        [`/familyAndHousehold/#${childId}/maritalStatus`]: createEnumWrapper(
          `married`,
          `/maritalStatusOptions`
        ),
        [`/familyAndHousehold/#${childId}/filingJointReturn`]: createBooleanWrapper(true),
        [`/familyAndHousehold/#${childId}/filingOnlyForRefund`]: createBooleanWrapper(true),
      });
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/jointReturnTest`, childId)).get).toBe(true);
      expect(factGraph.get(Path.concretePath(`/familyAndHousehold/*/qualifyingChild`, childId)).get).toBe(true);
    });
  });
});

describe(`Qualifying Child of Another - Tiebreaker Rules`, () => {
  it(`When child could be QC of another person, determines who has priority`, ({ task }) => {
    task.meta.testedFactPaths = [`/familyAndHousehold/*/isQualifyingChildOfAnother`];
    const { factGraph } = setupFactGraphDeprecated({
      ...biologicalChildBaseData,
      ...qcData,
      [`/familyAndHousehold/#${childId}/writableCouldBeQualifyingChildOfAnother`]: createBooleanWrapper(true),
      [`/familyAndHousehold/#${childId}/writablePotentialClaimerMustFile`]: createBooleanWrapper(true),
    });
    expect(
      factGraph.get(Path.concretePath(`/familyAndHousehold/*/isQualifyingChildOfAnother`, childId)).get
    ).toBe(true);
  });

  it(`Will not qualify as QC of another if other person not required to file and not filing`, ({ task }) => {
    task.meta.testedFactPaths = [`/familyAndHousehold/*/isQualifyingChildOfAnother`];
    const { factGraph } = setupFactGraphDeprecated({
      ...biologicalChildBaseData,
      ...qcData,
      [`/familyAndHousehold/#${childId}/writableCouldBeQualifyingChildOfAnother`]: createBooleanWrapper(true),
      [`/familyAndHousehold/#${childId}/writablePotentialClaimerMustFile`]: createBooleanWrapper(false),
      [`/familyAndHousehold/#${childId}/writablePotentialClaimerDidFile`]: createBooleanWrapper(false),
    });
    expect(
      factGraph.get(Path.concretePath(`/familyAndHousehold/*/isQualifyingChildOfAnother`, childId)).get
    ).toBe(false);
  });
});
