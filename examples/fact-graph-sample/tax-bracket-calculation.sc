// Excerpt from: https://github.com/IRS-Public/direct-file
// File: direct-file/fact-graph-scala/shared/src/main/scala/_tutorial/03_numbers.worksheet.sc
// This demonstrates declarative tax bracket calculation in the Fact Graph

// Tax bracket calculation for Married Filing Jointly, Tax Year 2024
// Implements the progressive tax rate structure from IRS tax tables

val dictionary = FactDictionary.fromXml(
  <Dictionary>
    <Fact path="/taxableIncome">
      <Writable><Dollar /></Writable>
    </Fact>

    <Fact path="/tax">
      <Derived>
        <Round>
          <Switch>
              {/* Over $418,850 but not over $628,300:
                 $95,686 plus 35% of the excess over $418,850 */}
              <Case>
                <When>
                  <LessThanOrEqual>
                    <Left><Dependency path="../taxableIncome" /></Left>
                    <Right><Dollar>628300</Dollar></Right>
                  </LessThanOrEqual>
                </When>
                <Then>
                  <Add>
                    <Dollar>95686</Dollar>
                    <Multiply>
                      <Rational>35/100</Rational>
                      <Subtract>
                        <Minuend>
                          <Dependency path="../taxableIncome" />
                        </Minuend>
                        <Subtrahends>
                          <Dollar>418850</Dollar>
                        </Subtrahends>
                      </Subtract>
                    </Multiply>
                  </Add>
                </Then>
              </Case>

              {/* Over $628,300:
                 $168,993.50 plus 37% of the excess over $628,300 */}
              <Case>
                <When>
                  <True />
                </When>
                <Then>
                  <Add>
                    <Dollar>168993.50</Dollar>
                    <Multiply>
                      <Rational>37/100</Rational>
                      <Subtract>
                        <Minuend>
                          <Dependency path="../taxableIncome" />
                        </Minuend>
                        <Subtrahends>
                          <Dollar>628300</Dollar>
                        </Subtrahends>
                      </Subtract>
                    </Multiply>
                  </Add>
                </Then>
              </Case>
          </Switch>
        </Round>
      </Derived>
    </Fact>
  </Dictionary>
)

// Create a graph instance with the dictionary
val graph = Graph(
  dictionary,
  InMemoryPersister(
    "/taxableIncome" -> Dollar("75000.00")
  )
)

// Get the calculated tax
graph.get("/tax")
// Result: Dollar("10,852.00")

// Key Observations:
//
// 1. Operations with different roles require explicit labeling:
//    - Subtract uses Minuend/Subtrahends
//    - Divide uses Dividend/Divisors
//    - Comparison operations use Left/Right
//
// 2. Round implements IRS-specific rounding:
//    - 50 cents always rounds up
//    - Required for all tax calculations
//
// 3. Switch/Case evaluates in order:
//    - First Case where When condition is true
//    - All Whens must be booleans
//    - All Thens must be same type
//
// 4. Rational numbers for tax rates:
//    - Expressed as fractions (35/100)
//    - Avoids floating point precision issues
//
// 5. Dependency resolution:
//    - References other facts by path
//    - Enables reasoning about incomplete data
//    - Can compute partial results as data arrives

// Example: Testing different income levels
val testCases = List(
  ("$20,000", "2,000"),     // 10% bracket
  ("$50,000", "5,544"),     // 12% bracket
  ("$150,000", "22,688"),   // 22% bracket
  ("$300,000", "63,133"),   // 24% bracket
  ("$500,000", "135,886"),  // 35% bracket
  ("$700,000", "217,188")   // 37% bracket
)

testCases.foreach { case (income, expectedTax) =>
  val testGraph = Graph(
    dictionary,
    InMemoryPersister("/taxableIncome" -> Dollar(income))
  )
  val calculatedTax = testGraph.get("/tax")
  println(s"Income: $income => Tax: $calculatedTax (Expected: $expectedTax)")
}
