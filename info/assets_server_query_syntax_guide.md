# Assets Server Query Syntax Guide

## Basic Query Structure

-   Individual terms: single words (e.g., `hello`)
-   Phrases: words in double quotes (e.g., `"hello world"`)
-   Field-specific: `fieldname:value` (e.g., `status:Production`)

## Boolean Operators

**Note:** Operators MUST BE UPPERCASE

| Operator         | Description                | Example                         |
| ---------------- | -------------------------- | ------------------------------- |
| `AND` (or `&&`)  | Both conditions must match | `status:Draft AND creator:John` |
| `OR` (or `\|\|`) | Either condition matches   | `status:New OR status:Draft`    |
| `NOT` (or `!`)   | Exclude matches            | `status:Draft NOT creator:John` |
| `+`              | Must include term          | `+status:Production`            |
| `-`              | Must exclude term          | `*:* -status:Final`             |

## Range Queries

-   Inclusive range: `[value1 TO value2]`
-   Exclusive range: `{value1 TO value2}`
-   Use `*` for unbounded ranges

### Examples:

```
resolutionX:[100 TO 300]               # Values between 100-300 inclusive
dueDate:[2020-12-29 TO 2020-12-31}     # From 29-30 Dec (31st excluded)
licenseStartDate:[* TO NOW]            # All dates up to now
fileSize:[1000000 TO *]                # Files larger than 1MB
```

## Date Patterns

Primary format: `yyyy-MM-dd'T'HH:mm:ssZ`

Valid date formats:

```
2020-05-01T00:00:00    # Full datetime
2020-05-01             # Date only
2020/05/01             # Alternative separator
2020:05:01             # Alternative separator
20200501               # Compact format
```

## Date Math Operations

| Expression           | Result                 |
| -------------------- | ---------------------- |
| `@DAY`               | Round to start of day  |
| `@HOUR`              | Round to start of hour |
| `+2YEARS`            | Add 2 years            |
| `-1DAY`              | Subtract 1 day         |
| `@DAY+6MONTHS+3DAYS` | Complex date math      |

### Example:

```
# Find files with license start date exactly today
licenseStartDate:[NOW@DAY TO NOW@DAY+1DAY-1SECOND]
```

## Wildcards

-   `?` - Single character wildcard
-   `*` - Multiple character wildcard
-   **Important:** Do not use wildcards at start of word (poor performance)

### Examples:

```
te?t        # Matches "test" or "text"
test*       # Matches any term starting with "test"
status:*    # Matches any file with a status
```

## Grouping

-   Use parentheses for logical grouping
-   Group multiple clauses for same field

### Examples:

```
(status:New OR status:Draft) AND usageRights:"Rights managed"
description:(+Reuters +free +use)    # All terms must exist in description
```

## Special Characters

The following characters must be escaped with a backslash when used in queries:

```
- && || ! ( ) { } [ ] ^ " ~ * ? : \
```

### Example:

```
copyright:John\&Doe    # Searching for "John&Doe"
```

## Relation Queries

Format:

```
relatedTo:<asset id>
[relationTarget:any|child|parent]
[relationType:contains|related|...]
```

**Important Rules:**

1. Must be placed at start of query
2. Cannot use Boolean operators with relation queries
3. Order of elements must be maintained

### Examples:

```
# Find contents of a collection
relatedTo:6mPOhZmlak-89zedbCx4oJ relationTarget:child relationType:contains

# Correct way to combine with filters
relatedTo:20HKy2L1qeHA9Ll-G1LKSM viewCount:2

# Incorrect way (will cause error)
relatedTo:20HKy2L1qeHA9Ll-G1LKSM AND viewCount:2
```

## Best Practices

1. Always use proper field names (e.g., `fileType`, `assetType`, `folderPath`)
2. Use `ancestorPaths` instead of `folderPath` for recursive folder searches
3. For date ranges, include time component to avoid unexpected results
4. Use wildcards sparingly for better performance
5. When excluding results, combine with `*:*` (e.g., `*:* -status:Final`)
