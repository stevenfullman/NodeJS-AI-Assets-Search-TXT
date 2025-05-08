const { OpenAI } = require("openai");
const DateHandler = require("./dateHandler");

class QueryIntentParser {
	constructor(openaiApiKey, context = {}) {
		this.openai = new OpenAI({ apiKey: openaiApiKey });
		this.context = {
			current_user: context.current_user || "anonymous",
			current_folder: context.current_folder || "/",
			current_date: context.current_date || new Date().toISOString(),
		};
		this.dateHandler = new DateHandler(this.context.current_date);
	}

	async parseQuery(naturalLanguageQuery) {
		try {
			const parsedCriteria = await this._getLLMResponse(naturalLanguageQuery);

			console.log("Parsed criteria:", parsedCriteria);
			const woodwingQuery = this._transformToWoodwingQuery(parsedCriteria);
			return woodwingQuery;
		} catch (error) {
			console.error("Error in parseQuery:", error);
			throw error;
		}
	}

	async _getLLMResponse(query) {
		const response = await this.openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content: require("../config/systemPrompt"),
				},
				{
					role: "user",
					content: query,
				},
			],
			response_format: { type: "json_object" },
			temperature: 0.1,
		});

		const result = JSON.parse(response.choices[0].message.content);
		this._validateResponse(result);
		return result;
	}

	_transformToWoodwingQuery(parsedCriteria) {
		const queryParts = [];
		const criteria = parsedCriteria.criteria;

		// Group criteria by category for proper handling
		const groupedCriteria = this._groupCriteriaByCategory(criteria);

		// Handle file identification (special case for domain + extension)
		if (groupedCriteria.file_identification) {
			const fileQuery = this._handleFileIdentification(groupedCriteria.file_identification);
			if (fileQuery) queryParts.push(fileQuery);
		}

		// Handle personal context
		if (groupedCriteria.personal_context) {
			const personalQuery = this._handlePersonalContext(groupedCriteria.personal_context);
			if (personalQuery) queryParts.push(personalQuery);
		}

		// Handle date operations
		if (groupedCriteria.date_operations) {
			const dateQuery = this._handleDateOperations(groupedCriteria.date_operations);
			if (dateQuery) queryParts.push(dateQuery);
		}

		// Handle workflow status
		if (groupedCriteria.workflow_status) {
			const statusQuery = this._handleWorkflowStatus(groupedCriteria.workflow_status);
			if (statusQuery) queryParts.push(statusQuery);
		}

		// Handle folder identification
		if (groupedCriteria.folder_identification) {
			const folderQuery = this._handleFolderIdentification(groupedCriteria.folder_identification);
			if (folderQuery) queryParts.push(folderQuery);
		}

		// Handle person operations
		if (groupedCriteria.person_operations) {
			const personQuery = this._handlePersonOperations(groupedCriteria.person_operations);
			if (personQuery) queryParts.push(personQuery);
		}

		// Join all parts with AND
		return queryParts.join(" AND "); // AND must be uppercase per syntax rules
	}

	_groupCriteriaByCategory(criteria) {
		return criteria.reduce((acc, criterion) => {
			if (!acc[criterion.category]) {
				acc[criterion.category] = [];
			}
			acc[criterion.category].push(criterion);
			return acc;
		}, {});
	}

	_handleFileIdentification(criteria) {
		const domainCriteria = criteria.filter((c) => c.subcategory === "asset_domain");
		const extensionCriteria = criteria.filter((c) => c.subcategory === "extension");

		if (!domainCriteria.length && !extensionCriteria.length) return null;

		const parts = [];

		// Handle asset domains
		if (domainCriteria.length) {
			const domains = domainCriteria.flatMap((c) => (Array.isArray(c.subject) ? c.subject : [c.subject]));
			const domainQueries = domains.map((domain) => `assetDomain:${this._formatFieldValue(domain)}`);
			parts.push(domainQueries.length > 1 ? `(${domainQueries.join(" OR ")})` : domainQueries[0]);
		}

		// Handle extensions
		if (extensionCriteria.length) {
			const extensions = extensionCriteria.flatMap((c) => (Array.isArray(c.subject) ? c.subject : [c.subject]));
			const extensionQueries = extensions.map((ext) => `extension:${this._formatFieldValue(ext)}`);
			parts.push(extensionQueries.length > 1 ? `(${extensionQueries.join(" OR ")})` : extensionQueries[0]);
		}

		// If both domain and extension are present, combine with OR
		return parts.length > 1 ? `(${parts.join(" OR ")})` : parts[0];
	}

	_handlePersonalContext(criteria) {
		const queries = criteria
			.map((criterion) => {
				const user = this.context.current_user;
				console.log("user", user);
				switch (criterion.subcategory) {
					case "my_created":
						return `assetCreator:${this._formatFieldValue(user)}`;
					case "my_modified":
						return `assetModifier:${this._formatFieldValue(user)}`;
					case "my_assigned":
						return `assignee:${this._formatFieldValue(user)}`;
					default:
						return null;
				}
			})
			.filter(Boolean);

		return queries.length ? (queries.length > 1 ? `(${queries.join(" AND ")})` : queries[0]) : null;
	}

	_handleDateOperations(criteria) {
		// Group criteria by field to identify range queries
		const groupedByField = {};
		criteria.forEach((criterion) => {
			const field = this._getDateField(criterion.subcategory);
			if (!groupedByField[field]) {
				groupedByField[field] = [];
			}
			groupedByField[field].push(criterion);
		});

		const queryParts = [];

		// Process each field's criteria
		for (const [field, fieldCriteria] of Object.entries(groupedByField)) {
			try {
				// Look for matching pairs of >= and <= operators
				const startCriterion = fieldCriteria.find((c) => c.operator === ">=");
				const endCriterion = fieldCriteria.find((c) => c.operator === "<=");

				if (startCriterion && endCriterion) {
					// Handle date range
					const startDate = this.dateHandler.parseDateExpression(startCriterion.subject);
					const endDate = this.dateHandler.parseDateExpression(endCriterion.subject);
					queryParts.push(`${field}:[${startDate} TO ${endDate}]`);
				} else {
					// Handle single date criteria
					fieldCriteria.forEach((criterion) => {
						// Handle special date expressions
						if (criterion.operator === "=") {
							const dateExpr = this.dateHandler.parseDateExpression(criterion.subject);
							queryParts.push(`${field}:${dateExpr}`);
							return;
						}

						// Handle individual operators
						const date = this.dateHandler.parseDateExpression(criterion.subject);
						if (criterion.operator === ">" || criterion.operator === ">=") {
							queryParts.push(`${field}:[${date} TO *]`);
						} else if (criterion.operator === "<" || criterion.operator === "<=") {
							queryParts.push(`${field}:[* TO ${date}]`);
						} else {
							queryParts.push(`${field}:"${date}"`);
						}
					});
				}
			} catch (error) {
				console.error(`Error handling date operation: ${error.message}`);
				throw new Error(`Invalid date expression for field ${field}: ${error.message}`);
			}
		}

		return queryParts.join(" AND ");
	}

	_getDateField(subcategory) {
		const dateFieldMap = {
			created: "assetCreated",
			modified: "assetModified",
			imported: "assetCreated",
			uploaded: "assetCreated",
			due_date: "dueDate",
		};
		return dateFieldMap[subcategory] || subcategory;
	}

	_escapeValue(value) {
		// Escape special characters: + - && || ! ( ) { } [ ] ^ " ~ * ? : \ /
		return value.replace(/[+\-&|!(){}[\]^"~*?:\\\/]/g, "\\");
	}

	_handleWorkflowStatus(criteria) {
		return criteria
			.map((criterion) => {
				const subjects = Array.isArray(criterion.subject) ? criterion.subject : [criterion.subject];
				const escapedSubjects = subjects.map((s) => this._formatFieldValue(s));

				// Each status field needs its own OR group if multiple values
				const statusQueries = ["status", "approvalState", "cf_Status"].map((field) => {
					const fieldQueries = escapedSubjects.map((subject) => `${field}:${subject}`);
					return fieldQueries.length > 1 ? `(${fieldQueries.join(" OR ")})` : fieldQueries[0];
				});

				// Combine all status field queries
				return `(${statusQueries.join(" OR ")})`;
			})
			.join(" AND ");
	}

	_handleFolderIdentification(criteria) {
		return criteria
			.map((criterion) => {
				const path =
					criterion.subcategory === "folder_name"
						? `${this.context.current_folder}/${criterion.subject}`.replace(/\/+/g, "/") // Normalize slashes
						: criterion.subject;

				const formattedPath = this._formatFieldValue(path);

				switch (criterion.subcategory) {
					case "folder_name":
						return `folderPath:${formattedPath}`;
					case "ancestor_path":
						return `ancestorPaths:${formattedPath}`;
					default:
						return `folderPath:${formattedPath}`;
				}
			})
			.join(" AND ");
	}

	_handlePersonOperations(criteria) {
		return criteria
			.map((criterion) => {
				const field = this._getPersonField(criterion.subcategory);
				const subjects = Array.isArray(criterion.subject) ? criterion.subject : [criterion.subject];
				const formattedSubjects = subjects.map((s) => `${field}:${this._formatFieldValue(s)}`);
				return formattedSubjects.length > 1 ? `(${formattedSubjects.join(" OR ")})` : formattedSubjects[0];
			})
			.join(" AND ");
	}

	_getPersonField(subcategory) {
		const personFieldMap = {
			creator: "assetCreator",
			modifier: "assetModifier",
			tutor: "cf_TutorName",
			assignee: "assignee",
		};
		return personFieldMap[subcategory] || subcategory;
	}

	_validateResponse(response) {
		if (!response.criteria || !Array.isArray(response.criteria)) {
			throw new Error("Invalid response format: missing criteria array");
		}

		response.criteria.forEach((criterion, index) => {
			const required = ["category", "subcategory", "subject", "operator"];
			for (const field of required) {
				if (!criterion[field] && criterion[field] !== "") {
					console.error(`Invalid criterion at index ${index}:`, criterion);
					throw new Error(`Missing required field '${field}' in criterion ${index}`);
				}
			}

			if (Array.isArray(criterion.subject)) {
				if (criterion.subject.length === 0) {
					throw new Error(`Empty array in subject field for criterion ${index}`);
				}
				if (criterion.subject.some((item) => typeof item !== "string")) {
					throw new Error(`Non-string value in subject array for criterion ${index}`);
				}
			} else if (criterion.subject !== null && typeof criterion.subject !== "string") {
				throw new Error(`Invalid subject type for criterion ${index}`);
			}
		});
	}

	_formatFieldValue(value) {
		// Handle null or undefined values
		if (value == null) return '""';

		// Convert to string and escape special characters
		const escapedValue = this._escapeValue(String(value));

		// If the value contains spaces or special characters, wrap in quotes
		return /[\s():]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
	}
}

module.exports = QueryIntentParser;
