// test-dates.js
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const DateHandler = require("../src/services/dateHandler");
const QueryIntentParser = require("../src/services/QueryIntentParser");

async function testDateHandling() {
	// Create a fixed context date for consistent testing
	const context = {
		current_user: "will.dawkins@fitchlearning.com",
		current_folder: "/Documents/Finance",
		current_date: new Date().toISOString(),
	};
	const dateHandler = new DateHandler(context.current_date);

	console.log("Testing date expressions:");
	console.log("-".repeat(50));

	// Test specific date formats
	console.log("Specific date:");
	console.log("January 1st 2024 ->", dateHandler.parseDateExpression("January 1st 2024"));

	// Test date ranges
	console.log("\nDate range:");
	console.log(
		"between January 1st and March 1st ->",
		dateHandler.createDateRangeQuery("January 1st 2024", "March 1st 2024")
	);

	// Test relative dates
	console.log("\nRelative dates:");
	console.log("this month ->", dateHandler.parseDateExpression("this month"));
	console.log("last week ->", dateHandler.parseDateExpression("last week"));
	console.log("last 2 weeks ->", dateHandler.parseDateExpression("last 2 weeks"));

	// Test with QueryIntentParser
	console.log("\nTesting full query parsing:");
	console.log("-".repeat(50));

	const parser = new QueryIntentParser(process.env.OPENAI_API_KEY, context);

	// Test cases matching your examples
	const testCases = [
		{
			criteria: [
				{
					category: "date_operations",
					subcategory: "modified",
					subject: "January 1st",
					operator: ">=",
				},
				{
					category: "date_operations",
					subcategory: "modified",
					subject: "March 1st",
					operator: "<=",
				},
			],
		},
		{
			criteria: [
				{
					category: "date_operations",
					subcategory: "created",
					subject: "this month",
					operator: "=",
				},
			],
		},
		{
			criteria: [
				{
					category: "date_operations",
					subcategory: "modified",
					subject: "last week",
					operator: "=",
				},
			],
		},
		// Test multiple date fields
		{
			criteria: [
				{
					category: "date_operations",
					subcategory: "created",
					subject: "January 1st",
					operator: ">=",
				},
				{
					category: "date_operations",
					subcategory: "created",
					subject: "March 1st",
					operator: "<=",
				},
				{
					category: "date_operations",
					subcategory: "modified",
					subject: "last week",
					operator: "=",
				},
			],
		},
	];

	for (const testCase of testCases) {
		console.log("Input:", JSON.stringify(testCase, null, 2));
		console.log("Output:", parser._handleDateOperations(testCase.criteria));
		console.log();
	}
}

testDateHandling().catch(console.error);
