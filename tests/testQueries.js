require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const QueryIntentParser = require("../src/services/QueryIntentParser");

const testQueries = [
	// Personal context queries
	"show me PDFs larger than 2MB that I uploaded to the Finance folder in the past 2 weeks",
	"find all spreadsheets I modified yesterday",
	"my documents in the Training folder",

	// Specific person queries
	"find all mp3s johndoe uploaded this week",
	"show me spreadsheets modified by anyone except me in the last 30 days",
	"documents created by Sarah in Marketing folder",

	// Complex file type queries
	"show me all spreadsheets and word documents in the Reports folder",
	"find large PDFs or images in the Assets folder",

	// Date range queries
	"show files modified between January 1st and March 1st",
	"documents due next week",

	// Mixed criteria
	"show me large videos uploaded by John or Sarah this month",
	"find approved documents I created in the last 2 weeks",
];

async function runTests() {
	const context = {
		current_user: "will.dawkins@fitchlearning.com",
		current_folder: "/Documents/Finance",
		current_date: new Date().toISOString(),
	};
	const parser = new QueryIntentParser(process.env.OPENAI_API_KEY, context);

	// Add timestamp for filename
	const now = new Date();
	const timestamp =
		now.getFullYear().toString().slice(-2) +
		String(now.getMonth() + 1).padStart(2, "0") +
		String(now.getDate()).padStart(2, "0") +
		String(now.getHours()).padStart(2, "0") +
		String(now.getMinutes()).padStart(2, "0") +
		String(now.getSeconds()).padStart(2, "0");

	const fs = require("fs");
	const path = require("path");
	const resultsDir = path.resolve(__dirname, "./results");

	// Create results directory if it doesn't exist
	if (!fs.existsSync(resultsDir)) {
		fs.mkdirSync(resultsDir, { recursive: true });
	}

	const outputPath = path.join(resultsDir, `moreTestsTXT_${timestamp}.txt`);
	let output = "";

	for (const query of testQueries) {
		output += "\n" + "=".repeat(80) + "\n";
		output += "Testing query: " + query + "\n";
		output += "-".repeat(80) + "\n";

		try {
			const result = await parser.parseQuery(query);
			output += "Result: " + JSON.stringify(result, null, 2) + "\n";
			// Also keep console output for development
			console.log(output);
		} catch (error) {
			const errorMsg = "Error processing query: " + error.message + "\n";
			output += errorMsg;
			console.error(errorMsg);
		}
	}

	// Write results to file
	fs.writeFileSync(outputPath, output);
	console.log(`\nResults saved to: ${outputPath}`);
}

runTests().catch(console.error);
