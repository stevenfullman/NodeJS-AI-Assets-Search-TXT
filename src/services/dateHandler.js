// dateHandler.js

class DateHandler {
	constructor(contextDate = new Date()) {
		// Convert string dates to Date objects
		this.contextDate = contextDate instanceof Date ? contextDate : new Date(contextDate);

		// Validate the date
		if (isNaN(this.contextDate.getTime())) {
			throw new Error("Invalid date provided to DateHandler");
		}
	}

	/**
	 * Converts various date formats and expressions to WoodWing-compatible date strings
	 * @param {string} dateExpr - Date expression (e.g., "last week", "January 1st", etc.)
	 * @returns {string} Formatted date string
	 */
	parseDateExpression(dateExpr) {
		if (!dateExpr) return null;

		// Handle special expressions
		const specialExpr = this._handleSpecialExpression(dateExpr);
		if (specialExpr) return specialExpr;

		// Try parsing as a specific date
		const date = this._parseSpecificDate(dateExpr);
		if (date) {
			return this.formatDate(date);
		}

		throw new Error(`Unable to parse date expression: ${dateExpr}`);
	}

	/**
	 * Handles special date expressions like "last week", "this month", etc.
	 * @param {string} expr - Date expression
	 * @returns {string|null} Date range or null if not a special expression
	 */
	_handleSpecialExpression(expr) {
		const normalized = expr.toLowerCase().trim();

		// Handle "today" and "yesterday"
		switch (normalized) {
			case "today": {
				const date = new Date(this.contextDate);
				this._alignToUnitStart(date, "day");
				const endDate = new Date(date);
				this._alignToUnitEnd(endDate, "day");
				return `[${this.formatDate(date)} TO ${this.formatDate(endDate)}]`;
			}
			case "yesterday": {
				const date = new Date(this.contextDate);
				date.setDate(date.getDate() - 1);
				this._alignToUnitStart(date, "day");
				const endDate = new Date(date);
				this._alignToUnitEnd(endDate, "day");
				return `[${this.formatDate(date)} TO ${this.formatDate(endDate)}]`;
			}
		}

		const monthMap = {
			january: 0,
			february: 1,
			march: 2,
			april: 3,
			may: 4,
			june: 5,
			july: 6,
			august: 7,
			september: 8,
			october: 9,
			november: 10,
			december: 11,
		};

		// Handle relative time expressions
		const timePattern = /^(this|next|last|past)\s+(\d+)?\s*(day|week|month|year)s?$/;
		const timeMatch = normalized.match(timePattern);

		if (timeMatch) {
			const [_, relation, amount, unit] = timeMatch;
			const startDate = new Date(this.contextDate);
			const endDate = new Date(this.contextDate);

			// Default to 1 if no amount specified (e.g., "this month" = "this 1 month")
			const numberOfUnits = parseInt(amount) || 1;

			switch (relation) {
				case "this":
					// Align to start of current unit
					this._alignToUnitStart(startDate, unit);
					this._alignToUnitEnd(endDate, unit);
					break;

				case "next":
					// Move to start of next unit(s)
					this._alignToUnitStart(startDate, unit);
					this._moveForward(startDate, unit, numberOfUnits);
					this._alignToUnitStart(endDate, unit);
					this._moveForward(endDate, unit, numberOfUnits);
					this._alignToUnitEnd(endDate, unit);
					break;

				case "last":
				case "past":
					// Move backwards by unit(s)
					this._moveBackward(startDate, unit, numberOfUnits);
					this._alignToUnitStart(startDate, unit);
					endDate.setHours(23, 59, 59, 999);
					break;
			}

			return `[${this.formatDate(startDate)} TO ${this.formatDate(endDate)}]`;
		}

		// Handle month names
		for (const [monthName, monthIndex] of Object.entries(monthMap)) {
			if (normalized.includes(monthName)) {
				// Extract year and day if present, otherwise use current year
				const year = normalized.match(/\d{4}/)
					? parseInt(normalized.match(/\d{4}/)[0])
					: this.contextDate.getFullYear();

				// Extract day if present
				let day = 1;
				const dayMatch = normalized.match(/(\d{1,2})(st|nd|rd|th)?/);
				if (dayMatch) {
					day = parseInt(dayMatch[1]);
				}

				const date = new Date(year, monthIndex, day);
				return this.formatDate(date);
			}
		}

		return null;
	}

	/**
	 * Parses specific date formats
	 * @param {string} dateStr - Date string
	 * @returns {Date|null} Parsed date or null if invalid
	 */
	_parseSpecificDate(dateStr) {
		// Remove ordinal indicators
		const cleanStr = dateStr.replace(/(st|nd|rd|th)/g, "");

		// Try parsing the date
		const date = new Date(cleanStr);
		if (!isNaN(date.getTime())) {
			return date;
		}

		return null;
	}

	/**
	 * Formats a date according to WoodWing's expected format
	 * @param {Date} date - Date to format
	 * @returns {string} Formatted date string
	 */
	formatDate(date) {
		return date.toISOString().replace(/\.\d{3}Z$/, "");
	}

	/**
	 * Creates a date range query
	 * @param {string} start - Start date expression
	 * @param {string} end - End date expression
	 * @returns {string} Formatted date range query
	 */
	createDateRangeQuery(start, end) {
		const startDate = this.parseDateExpression(start);
		const endDate = this.parseDateExpression(end);

		if (!startDate || !endDate) {
			throw new Error("Invalid date range");
		}

		return `[${startDate} TO ${endDate}]`;
	}

	// Add these helper methods to the class
	_alignToUnitStart(date, unit) {
		switch (unit) {
			case "day":
				date.setHours(0, 0, 0, 0);
				break;
			case "week":
				const day = date.getDay();
				date.setDate(date.getDate() - day);
				date.setHours(0, 0, 0, 0);
				break;
			case "month":
				date.setDate(1);
				date.setHours(0, 0, 0, 0);
				break;
		}
	}

	_alignToUnitEnd(date, unit) {
		switch (unit) {
			case "day":
				date.setHours(23, 59, 59, 999);
				break;
			case "week":
				const day = date.getDay();
				date.setDate(date.getDate() + (6 - day));
				date.setHours(23, 59, 59, 999);
				break;
			case "month":
				date.setMonth(date.getMonth() + 1, 0); // Last day of current month
				date.setHours(23, 59, 59, 999);
				break;
		}
	}

	_moveForward(date, unit, amount) {
		switch (unit) {
			case "day":
				date.setDate(date.getDate() + amount);
				break;
			case "week":
				date.setDate(date.getDate() + amount * 7);
				break;
			case "month":
				date.setMonth(date.getMonth() + amount);
				break;
		}
	}

	_moveBackward(date, unit, amount) {
		this._moveForward(date, unit, -amount);
	}
}

module.exports = DateHandler;
