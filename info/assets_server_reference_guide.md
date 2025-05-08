# REFERENCE MATERIAL FOR ASSETS SERVER METADATA

# 1. Metadata in Assets Server - introduction

Metadata is information that describes specific aspects of a file and its content. It tells you:

-   **Who created the file**
-   **What type of file it is**
-   **Where the file is stored**
-   **When the file was created**
-   **... and much more**

**Example:** When taking an image with your phone or compact camera, the date, time, device model is stored.

All this information is stored within the file itself, meaning that when you move the file (for example by sending it to someone else or by uploading it to Assets Server), the metadata is moved with it.

When working with files on a computer, you will come across metadata everywhere: from simply viewing a file in a folder to right-clicking a file and bringing up the Properties dialog box on Windows or the Get Info dialog box on MacOS.

## Adding additional metadata

Apart from metadata that is automatically added (for example the Modified Date when saving a file), it is also possible to add additional metadata yourself.

**Example:** When selling an image, it makes sense to store your contact details and information about when and where the image was taken in the metadata.

This can be done in most applications in which you can edit the file such as in Word or Photoshop.

## Metadata in Assets Server

Working with files in Assets Server primarily revolves around searching for files. When performing a search in Assets Server, you are essentially searching in the metadata. The more metadata is available for the file, the more ways users have to find it.

### When uploading

When files are added to Assets Server, their metadata is extracted and added to the search index. This makes sure that the files are characterized and cataloged correctly so that they can be easily found.

### Editing

Of course, editing metadata is also possible and can be done by using Assets.

### On export

Metadata that has been added to files in Assets Server is — where possible — embedded in the files together with the original metadata.

When exporting a file from Assets Server (for example by downloading the original file) this metadata is also available in the downloaded file.

**Note:** Some metadata fields that contain confidential information may not be exported.

See also Working with embedded metadata in Assets Server.

### Custom metadata

Should any of the high number of metadata fields that are available in Assets Server not be sufficient, it is possible to create custom metadata fields.

Here's the content formatted in markdown:

# 2. Assets Server metadata fields explained

Many metadata fields exist in Assets Server and many of them store very similar data. This can make it confusing sometimes to know exactly which field to use when searching for files.

In this article we highlight some of these metadata fields.

## Fields that store date and time information

The following are examples of metadata fields that store date or date/time information.

| Name                                                 | Description                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checked In<br>_Internal name: assetFileModified_     | Date and time when the file was checked-in or when a file in a Collection was modified.                                                                                                                                                                                                                                               |
| Creation date<br>_Internal name: created_            | The embedded date and time when the file was created (not available for all assets).<br>Example: EXIF DateTimeOriginal: the date and time when a photo was taken as recorded by the camera with which the photo was taken.                                                                                                            |
| Enterprise created<br>_Internal name: sceCreated_    | The date when the asset was created in Studio Server.                                                                                                                                                                                                                                                                                 |
| Enterprise modified<br>_Internal name: sceModified_  | The date when the asset was modified in Studio Server.                                                                                                                                                                                                                                                                                |
| File Creation Date<br>_Internal name: fileCreated_   | Date and time when the asset was created on the file system. It is only read when manually importing the asset and cannot be read through Java or the exiftool (perl). When empty, the value of File Modified Date (fileModified) is used.                                                                                            |
| File Modified Date<br>_Internal name: fileModified_  | Date and time when the asset was modified on the file system.<br>**Note:** The usefulness of this field is questionable. For example if the asset was imported through the Web Service this will be the lastModified date of the temp file created for the Web Service attachment on the server, which is not a realistic time stamp. |
| Imported in Assets<br>_Internal name: assetCreated_  | Date and time when the asset was created in Assets Server by importing it.                                                                                                                                                                                                                                                            |
| IPTC creation date<br>_Internal name: iptcCreated_   | The embedded creation date read from IPTC or XMP-photoshop (not available for all assets).                                                                                                                                                                                                                                            |
| Modified date<br>_Internal name: modified_           | The embedded date when the asset was modified (not available for all assets).                                                                                                                                                                                                                                                         |
| Modified in Assets<br>_Internal name: assetModified_ | Date and time when the file was modified in some way in Assets Server. This includes Collections and files in Collections.                                                                                                                                                                                                            |
| XMP creation date<br>_Internal name: xmpCreated_     | The embedded creation date read from XMP (not available in all assets).                                                                                                                                                                                                                                                               |

## Fields that store file location information

Various metadata fields store information about the location where an asset is stored in the folder structure of Assets Server. Knowing how to use these fields is useful when searching, filtering or sorting assets.

This can best be shown by using an example. Consider the following path to an asset:

```
/Main Zone/sub folder A/sub folder B/someasset.txt
```

| Name                                                  | Description                                                                                           | Result                                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Path<br>_Internal name: assetPath_                    | Stores the full path to the asset: folders and file name.                                             | `/Main Zone/sub folder A/sub folder B/someasset.txt`                                |
| File name<br>_Internal name: filename_                | Stores the full file name including the extension.                                                    | `someasset.txt`                                                                     |
| Name<br>_Internal name: name_                         | The name of the asset.<br>For virtual assets such as a Collection, the extension is left out          | `someasset.txt`                                                                     |
| Directory<br>_Internal name: folderPath_              | Stores the folder part of the Path (assetPath) field, excluding the trailing slash and the file name. | `/Main Zone/sub folder A/sub folder B`                                              |
| Ancestor paths<br>_Internal name: ancestorPaths_      | This special field stores all 'ancestor' folder paths of the full path.                               | `/Main Zone/sub folder A/sub folder B`<br>`/Main Zone/sub folder A`<br>`/Main Zone` |
| Tokenized path<br>_Internal name: assetPathTokenized_ | Stores the tokenized version of the full asset path.                                                  | `Main Zone sub folder A B someasset txt`                                            |

### Some useful search examples:

Search for all assets in folder `/Main Zone/sub folder A`, including assets in subfolders:

```
ancestorPaths:"/Main Zone/sub folder A"
```

Search for all asset in folder `/Main Zone/sub folder A`, excluding assets in subfolders:

```
folderPath:"/Main Zone/sub folder A"
```

## Fields that store file type information

| Name                                    | Description                                                                                                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type<br>_Internal name: assetType_      | The extension of the file (.txt, .jpeg, .pdf and so on).<br>When the file extension is not mapped as an asset type, 'unknown' is used.                                                   |
| Extension<br>_Internal name: extension_ | The actual extension of the file (txt, jpeg, pdf and so on)                                                                                                                              |
| Kind<br>_Internal name: assetDomain_    | The 'kind' of file. Possible values:<br>- audio<br>- archive<br>- container<br>- document<br>- image<br>- layout<br>- pdf<br>- presentation<br>- text<br>- video<br>- xml<br>- generic   |
| File type<br>_Internal name: fileType_  | The file type as reported by the exiftool (JPEG, TXT, PDF and so on).                                                                                                                    |
| MIME type<br>_Internal name: mimeType_  | The MIME type: a method of classifying file types. It consists of a type and a subtype, divided by a slash (image/jpeg, application/pdf, video/quicktime, application/msword and so on). |

# 3. The Assets Server query syntax

Search queries in Assets Server are based on the Lucene query syntax.

The basic query format is identical, but Assets Server adds additional functionality in some places. For example with date range queries, Assets Server can parse various input formats and makes it possible to use dynamic queries and date/time arithmetic.

## Basics

For an overview of the basics of the Lucene query syntax, see for example the logz.io blog post Elasticsearch Queries: A Thorough Guide.

## Metadata references

When building a query, make sure to use the internal name for a metadata field and that it is written correctly (in camelCase).

For example, a file type is referred to as **fileType**, the extension of a file as **assetType**, the directory as **folderPath**, and so on.

For more information, see:

-   **Assets Server metadata fields explained**

## Queries and Webhooks

Note that when using queries to create a filter for a Webhook, that the use of wildcards is not supported (see also the Webhook API article).

## Rule queries

When creating permission rules in the Management Console, queries can be used for giving permissions if metadata meets specific criteria.

Although these queries use the same syntax as normal queries, not all query types can be used in these rules.

### Query types supported in rule queries

**Type Example**

#### Exact term query

Search for files by using a single word.

Searching for all images with the status 'Final':

```
assetDomain:image
status:Final
```

#### Phrase query

Search for files by using multiple words, contained in double quotes.

Searching for all files with the tag 'Nature' that are stored in the Demo Zone > Images folder:

```
tags:"Nature"
ancestorPaths:"/Demo Zone/Images"
```

#### Range query

Search for a range using numeric or date fields.

Searching for files for which the license expires, starting today:

```
licenseEndDate:[NOW TO *]
```

#### Boolean query

Search for files for which one or more conditions are true.

Searching for files with status Production or Correction for which not all required metadata fields are set and which license expires starting today:

```
(status:Production OR status:Correction) -metadataComplete:false
licenseStartDate:[* TO NOW] AND licenseEndDate:[NOW TO *]
```

### Metadata fields supported in rule queries

Not all metadata fields can be used in a rule query. Fields that can be used are:

-   **Un_tokenized fields**
-   **Tokenized fields with pureLowerCase analyzer**

More information on tokenization can be found on Wikipedia.
Field tokenization settings can be checked in Assets Server on the Metadata field information page (also known as the assetinfo report).

## Search queries

Search queries are used by end users who type in one or more search terms to search for.

A query is broken up into _terms_ (a single word or a group of words) and _operators_ (AND, OR, +, and so on).

### Term queries

A term can be a single word such as _hello_ or _world_ or a phrase: a group of words surrounded by double quotes such as "hello world".

Multiple terms can be combined with Boolean operators to form a complex query.

The search is performed on all metadata fields of a file.

### Field queries

To only search within specific metadata fields, the technical name of that field can be included. The format is as follows:

`<technical metadata field name>:<search term>`

**Examples**

Search for files where the value of the Usage Rights field is "Rights managed":

```
usageRights:"Rights managed"
```

Search for files where the value of the Status field is "Production":

```
status:Production
```

### Boolean queries and combining queries

A query may contain multiple fields or sub queries. These sub queries can be combined using logical operators.

**Note:** Operators must be ALL CAPS.

| Operator | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AND**  | Finds files where both query terms match the metadata._ Instead of AND, && can also be used._ When no operator is specified when combining multiple queries, the AND operator is used by default.Example: Search for files where Usage Rights is "Rights managed" and Status is "Production":`usageRights:"Rights managed" AND status:Production`                                                                                       |
| **OR**   | Links 2 queries to find matching files if either of the terms exist in the metadata.\* Instead of OR, \|\| can also be used.Example: Search for files where Status is "new" OR Status is "Draft":`status:New OR status:Draft`                                                                                                                                                                                                           |
| **+**    | Also known as the "must" operator. Requires that the term after the + symbol exists somewhere in a the field of a file.Examples:Search for files where Status is "Production":`+status:Production`Search for files where Usage Rights is "Rights managed" and Status is "Production":`usageRights:"Rights managed" +status:Production`                                                                                                  |
| **NOT**  | Excludes files that contain the term after NOT.\* Instead of NOT, ! can also be used.Example: Search for files where Usage Rights is "Rights managed" and Status is not "Production":`usageRights:"Rights managed" NOT status:Production`                                                                                                                                                                                               |
| **-**    | Also known as the prohibit operator. Excludes files that contain the term after the - symbol.Examples:Search for files where Status is not "Production" (note that this has to be prefixed with an 'all' search _:_; subtracting results from nothing is not possible):`_:_ -status:Production`Search for files where Usage Rights is "Rights managed" and Status is not "Production":`usageRights:"Rights managed" -status:Production` |

### Range queries

Range queries are used for finding files of which the values of one or more metadata fields fall between a starting value and an end value.

Range queries can be inclusive or exclusive of the starting and end value. Inclusive range queries are denoted by square brackets "[ ]"; exclusive range queries are denoted by curly brackets { }.

**Examples**

Search for files where Resolution X (DPI) is between 100 and 300 (inclusive):

```
resolutionX:[100 TO 300]
```

Search for files where the License start date is May 1st, 2nd, 3rd or 4th in the year 2020 (inclusive).
Note that when searching in datetime fields, a time should be specified. If only the date would be specified, the upper bound time would default to 00:00:00 which would not return any results for that day.

```
licenseStartDate:[2020-05-01T00:00:00 TO 2020-05-04T23:59:59]
```

Search for files with a due date of the 29th and 30th of December and none from the 31st of December:

```
dueDate:[2020-12-29 TO 2020-12-31}
```

A range query may also contain ANY lower or upper bound value, this can be specified by a \*.

**Examples**

Search for files where the License start date is up to and including May 2nd 2020:

```
licenseStartDate:{* TO 2020-05-02T23:59:59]
```

Search for files where the License start date is after May 2nd 2020:

```
licenseStartDate:{2020-05-02T00:00:00 TO *}
```

Range queries are particularly useful on date and number fields but can also be used on text fields.

**Example**

Search for documents whose titles are between aida and carmen:

```
title:[aida TO carmen]
```

### Known issue: Incorrect results for searches with dates with a time as upper bound

When performing a search for dates combined with a time as upper bound where the upper bound is specified to be excluded from the range, results can be unexpected.

Here's the next part:

**Example 1**

In this search the upper limit of 31st of December 2020 at 02:00:00 is specified to be excluded:

```
dueDate:[2020-12-31T00:00:00 TO 2020-12-31T02:00:00}
```

However, the results also show files with a due date of exactly 02:00:00.

**Example 2**

In this search the lower limit and upper limit include a time and are both specified to be excluded:

```
dueDate:{2020-12-31T00:00:00 TO 2020-12-31T02:00:00}
```

However, the results show files with a dueDate after 00:00:00 up to 02:00:00 but also incorrectly includes files with a dueDate of exactly 02:00:00.

### Grouping

Use parentheses to group clauses to form sub queries. This can be very useful to control the Boolean logic for a query.

**Example**

Search for files where Status is "New" or "Draft" and Usage Rights is "Rights managed":

```
(status:New OR status:Draft) AND usageRights:"Rights managed"
```

### Field grouping

Use parentheses to group multiple clauses to a single field.

**Example**

Search for files where Description contains "Reuters", "free" and "use":

```
description:(+Reuters +free +use)
```

## Additional queries

To further specify a search, use any of the additional queries described below.

# Query Reference

## Wildcard query

### Description

Broaden the search when not exactly knowing what to search for, or when variations of a term need to be included.

### Notes

-   Wildcards '\*' and '?' can be used.
-   Wildcard queries are much slower than regular queries; only use them when necessary.
-   Do not use a wildcard at the start of a word, such queries are very slow.

### Example

To find all files with a specific extension, do not use _filename:_.jpg*, but instead use *extension:jpg*. To find all assets below a folder, do not use *folderPath:/Demo Zone\** but instead use *ancestorPaths:"/Demo Zone"\*

### Usage Examples

Search for "test" and "text":

```
te?t
```

Search all terms starting with "test":

```
test*
```

## Fuzzy query

### Description

Search for words that are similar.

### Usage Examples

Search for a term similar in spelling to 'roam' such as 'foam' and 'roams':

```
roam~
```

Influence the required similarity by including a value between 0 (low similarity) and 1 (high similarity):

```
roam~0.8
```

The default similarity value is 0.5.

## Fields with values

### Description

Search for fields that have a value.

### Note

This query is slow on fields with many unique values such as the 'filename' field.

### Usage Example

Find all files that have a status entered:

```
status:*
```

## Find all files

### Description

Search for all files.

### Usage Examples

Search for all files:

```
*:*
```

### When to use it

The usefulness of this query is limited. One specific case is to search for files that do not have a specific field value:

```
-status:Final **(wont work)**
```

In Lucene, the "-" or NOT operators can only 'filter' files that are matched by another part of the query. Because there is no 'other part' of the query, one can be simulated by using a 'find all files' query.

Search for files that do not have status "Final":

```
*:* -status:Final
```

Another useful case is when searching for files that do not have a value entered for a specific field. Lucene cannot find these files because it cannot search for a field that has no value. By using a 'find all files' query and subtracting all files that _do_ have a value for the field it is possible to get the desired result:

```
*:* -copyright:*
```

## Relation queries

### Description

Search for files that are related to other files.

### Format

The following format is used:

```
relatedTo:<asset id>
[relationTarget:any|child|parent]
[relationType:contains|related|...]
[...normal query filters...]
```

### Notes

-   Put the statement at the very start of the query and respect the exact order used above. The normal query filters can be put at the end of the relation query elements.
-   Relation queries cannot be combined with other sub queries by using explicit logical operations. Doing so will result in a query error (PrivateMalformedQueryException).
-   The inclusion of `relationTarget` and `relationType` is optional; they can be omitted to search all material related to the asset.
-   The following keywords can be used for the relationType field:
    -   contains
    -   duplicate
    -   references
    -   related
    -   variation

### Usage Examples

Search the contents of the Collection with id "6mPOhZmlak-89zedbCx4oJ":

```
relatedTo:6mPOhZmlak-89zedbCx4oJ relationTarget:child relationType:contains
```

Incorrect use of operators:

```
q=relatedTo:20HKy2L1qeHA9Ll-G1LKSM AND viewCount:2
```

Correct use of combining queries:

```
q=relatedTo:20HKy2L1qeHA9Ll-G1LKSM viewCount:2
```

```
q=relatedTo:20HKy2L1qeHA9Ll-G1LKSM assetType:png OR assetType:jpg
```

## Date and time queries

### Description

Search for files based on a date or date range.

### Notes

-   The pattern is yyyy-MM-dd'T'HH:mm:ssZ.
-   NOW represents the current date.

### Usage Examples

Search for files where the License start date is after a specific date and time:

```
licenseStartDate:[2020-07-04T12:08:56-0700 TO *]
```

Search for files where the License is still valid (current date between license start and end date):

```
licenseStartDate:[* TO NOW] AND licenseEndDate:[NOW TO *]
```

### Relation Query Examples

Search the contents of the Collection with id "6mPOhZmlak-89zedbCx4oJ":

```
relatedTo:6mPOhZmlak-89zedbCx4oJ relationTarget:child relationType:contains
```

Incorrect use of operators:

```
q=relatedTo:20HKy2L1qeHA9Ll-G1LKSM AND viewCount:2
```

Correct use of combining queries:

```
q=relatedTo:20HKy2L1qeHA9Ll-G1LKSM viewCount:2
q=relatedTo:20HKy2L1qeHA9Ll-G1LKSM assetType:png OR assetType:jpg
```

### Date and time queries

Search for files based on a date or date range.

Notes:

-   The pattern is `yyyy-MM-dd'T'HH:mm:ssZ`
-   `NOW` represents the current date.

Search for files where the License start date is after a specific date and time:

```
licenseStartDate:[2020-07-04T12:08:56-0700 TO *]
```

Search for files where the License is still valid (current date between license start and end date):

```
licenseStartDate:[* TO NOW] AND licenseEndDate:[NOW TO *]
```

## Date patterns

Date or datetime queries can use several different patterns to specify their date and time. The following list shows the date patterns supported by Assets Server. The first pattern that is recognized will be used to parse the date.

| Date and Time Pattern  | Result¹                  |
| ---------------------- | ------------------------ |
| yyyy-MM-dd'T'HH:mm:ssZ | 2010-07-04T12:08:56-0700 |
| yyyy-MM-dd'T'HH:mm:ss  | 2010-07-04T12:08:56      |
| yyyy:MM:dd             | 2010:07:04               |
| yyyy-MM-dd             | 2010-07-04               |
| yyyy/MM/dd             | 2010/07/04               |
| HH:mm:ss               | 12:08:56                 |
| GMT_Milliseconds       | 1278245336               |
| yyyyMMdd               | 20100704                 |

¹ For 2010-07-04 12:08:56 in the U.S. Pacific Time zone.

### Date math

Date math can be used to perform date calculations before the date is used by the query. Supported operations are: rounding (@), adding (+) and subtracting (-) date parts.

| Date math expression | Result                                                                   |
| -------------------- | ------------------------------------------------------------------------ |
| @HOUR                | Round to the start of the current hour.                                  |
| @DAY                 | Round to the start of the current day.                                   |
| +2YEARS              | Exactly two years in the future from now.                                |
| -1DAY                | Exactly 1 day prior to now.                                              |
| @DAY+6MONTHS+3DAYS   | 6 months and 3 days in the future from the start of the current day.     |
| +6MONTHS+3DAYS@DAY   | 6 months and 3 days in the future from now, rounded down to nearest day. |

Available date parts for math operations:

| Date part   | Aliases                                  |
| ----------- | ---------------------------------------- |
| Year        | Y, YEAR, YEARS                           |
| Month       | M, MONTH, MONTHS                         |
| Day         | D, DAY, DAYS, DATE                       |
| Hour        | H, HOUR, HOURS                           |
| Minute      | MIN, MINUTE, MINUTES                     |
| Second      | S, SECOND, SECONDS                       |
| Millisecond | MILLI, MILLIS, MILLISECOND, MILLISECONDS |

Example:
Search for files where the License start date is exactly today (between 00:00 and 23:59):

```
licenseStartDate:[NOW@DAY TO NOW@DAY+1DAY-1SECOND]
```

## Escaping Special Characters

The search engine uses special characters as part of the query syntax:

```
-   -   && || ! ( ) { } [ ] ^ " ~ \* ? : \
```

To use these special characters as values in queries, escape them by placing a \ before the character. For example: to search for John&Doe in the copyright field, use the query:

```
copyright:John\&Doe
```

# Available Assets Metadata Fields by Category:

## File:

### filename

-   **Purpose**: Whole file name, including extension.
-   **Example values**:
    -   example.png

### folderPath

-   **Purpose**: Folder part of assetPath, excluding trailing slash and file name.
-   **Example values**:
    -   /Some Zone/sub folder-A/sub folder-B

### ancestorPaths

-   **Purpose**: All ancestor paths of the full path. The values of the field are not stored and are therefore not visible in the client.
-   **Example values**:
    -   /Some Zone/sub folder-A/sub folder-B
    -   /Some Zone/sub folder-A
    -   /Some Zone

### name

-   **Purpose**: Name of the asset. Virtual assets such as Collections are shown without an extension.
-   **Example values**:
    -   someasset.txt
    -   somecollection

### baseName

-   **Purpose**: Name of the asset without extension.
-   **Example values**:
    -   someasset
    -   somecollection

### extension

-   **Purpose**: File name extension (excluding .).
-   **Example values**:
    -   txt
    -   png

### assetType

-   **Purpose**: Asset type, usually equal to extension unless the file extension is not mapped as an assetType, in which case it will use the 'unknown' assetType.
-   **Example values**:
    -   jpg
    -   wwcx

### assetDomain

-   **Purpose**: Asset domain, the type of asset.
-   **Example values**:
    -   Audio
    -   Container
    -   Document
    -   Image
    -   Layout
    -   PDF
    -   Presentation
    -   Text
    -   Video
    -   XML
    -   Generic

### fileSize

-   **Purpose**: File size in bytes.

### fileCreated

-   **Purpose**: Creation date of the file on the file system. Only read from the file system when manually importing in the client. The file system creation date cannot be read through Java or the ExifTool (Perl). When the fileCreated field is empty the value is set to the value of fileModified.

### fileModified

-   **Purpose**: Modified date of the file on the file system. If imported by the client, it is read from the client file system and may therefore not be a true representation of the actual modified date. For example: if the file was imported through the webservice this will be the lastModified date of the temp file created for the webservice attachement on the server.

### fileType

-   **Purpose**: Type of file as returned by the ExifTool. Only available for some file types.
-   **Example values**:
    -   PDF
    -   JPEG

### mimeType

-   **Purpose**: MIME type of the file.
-   **Example values**:
    -   application/pdf

## Dimensions:

### width

-   **Purpose**: Width in pixels.
-   **Example values**:
    -   2048

### height

-   **Purpose**: Height in pixels.
-   **Example values**:
    -   1536

### widthMm

-   **Purpose**: Width in millimeters. For PDFs this is taken from the TrimBox if available or otherwise from the MediaBox.
-   **Example values**:
    -   210

### heightMm

-   **Purpose**: Height in millimeters. For PDFs this is taken from the TrimBox if available or otherwise from the MediaBox.
-   **Example values**:
    -   297

### widthIn

-   **Purpose**: Width in inches. For PDFs this is taken from the TrimBox if available or otherwise from the MediaBox.
-   **Example values**:
    -   8.27

### heightIn

-   **Purpose**: Height in inches. For PDFs this is taken from the TrimBox if available or otherwise from the MediaBox.
-   **Example values**:
    -   11.69

### resolution

-   **Purpose**: Resolution in pixels.
-   **Example values**:
    -   72 px/inch

### imageOrientation

-   **Purpose**: Orientation of image dimensions.
-   **Example values**:
    -   Landscape
    -   Portrait
    -   Square

### imageAspectRatio

-   **Purpose**: Aspect ratio of image dimensions. This is a decimal value calculated as the width / height. It is calculated from the point unit so resolution is taken into account. This can be used to find assets with a similar or matching aspect ratio.
-   **Example values**:
    -   1.5 (landscape)
    -   0.69 (portrait)
    -   1 (square)

## General:

### tags

-   **Purpose**: Keywords are terms or phrases used to express the subject of the content in the asset. Keywords may be free text (meaning that they are not required to be taken from a controlled vocabulary). You may enter (or paste) any number of keywords, terms or phrases into this field, separated by a comma.
-   **Example values**:
    -   architecture, interior, modern, office
    -   abstract, background, curves, fractal, lines, wallpaper

### labels

-   **Purpose**: Keywords are terms or phrases used to express the subject of the content in the asset.

### description

-   **Purpose**: The description field (often referred to as a "caption") is used to describe the who, what (and possibly where and when) and why of the content. If there are people in an image, this caption might include their names, and/or their role in the action that is taking place. If the image is of a location, then it should give information regarding that location.
-   **Example values**:
    -   The Conservatory during Macquarie Night Lights, a summer festival
    -   Image of a goldfish in a small tank
    -   A rare look behind the scenes at China's secretive technology giant

### rating

-   **Purpose**: Rating of the content (1-5).
-   **Example values**:
    -   -1 (Rejected)
    -   1
    -   2
    -   3
    -   4
    -   5

### status

-   **Purpose**: Status of the file, can be used for workflow purposes. <strong>predefinedValues</strong> (onlyFromList=false) New Draft Production Review Correction Final New Draft Production Review Correction Final
-   **Valid values**:
    -   New
    -   Draft
    -   Production
    -   Review
    -   Correction
    -   Final
    -   New
    -   Draft
    -   Production
    -   Review
    -   Correction
    -   Final

### labelColor

-   **Purpose**: <strong>predefinedValues</strong> (onlyFromList=true) Red Orange Yellow Green Blue Purple Gray
-   **Valid values**:
    -   Red
    -   Orange
    -   Yellow
    -   Green
    -   Blue
    -   Purple
    -   Gray

### created

-   **Purpose**: Embedded creation date (for example EXIF DateTimeOriginal = time recorded by the camera that took the photo). Only available for assets with an embedded date time.

### modified

-   **Purpose**: Embedded modified date. Only available when it is embedded in the file.

### caption

-   **Purpose**: Deprecated because captions are mostly used as descriptions. Use the description field instead.

### captionWriter

-   **Purpose**: Writer of the description of an image, from the IPTC standard.

### title

-   **Purpose**: Title of the asset.
-   **Example values**:
    -   Field with purple flowers

### headline

-   **Purpose**: A brief publishable synopsis or summary of the contents of the file. Not to be confused with the Title field. Use the Description field for the supporting narrative.
-   **Example values**:
    -   The use of coffee to socialize in offices

### byline

-   **Purpose**: Author/Creator in IPTC standard (deprecated, use dc:Creator or Author in Photoshop panel).
-   **Example values**:
    -   Jane Doe and John Dont

### bylineTitle

-   **Purpose**: Author/Creator job title/position in IPTC (deprecated, use dc:CreatorJobTitle or Author's title in Photoshop panel).
-   **Example values**:
    -   Staff writer
    -   Independant photographer

### teaser

-   **Purpose**: Short description to attract attention to content.
-   **Example values**:
    -   What’s in a name? Bill Jamison explains ICANN and the Domain Name System

### software

-   **Purpose**: Software used to create the asset.
-   **Example values**:
    -   FotoWare FotoStation
    -   Adobe Photoshop

### reservedFor

-   **Purpose**: The name of the user for whom the asset is reserved for.

### assignee

-   **Purpose**: The name of the user to whom the asset is assigned.

### dueDate

-   **Purpose**: Due date/deadline of the asset.

### followers

-   **Purpose**: User names of persons being notified of changes to this or related assets.

### sharedUrl

-   **Purpose**: Shared URL for online access to the asset.
-   **Example values**:
    -   https://goo.gl/gd1fVX

## Approval:

### approvalState

-   **Purpose**: Indicates if the asset was approved or rejected. The approval state and an optional approval comment are set when assets are approved or rejected in a Shared link with an approval request. Allowed values: _ Approved _ Rejected <strong>predefinedValues</strong> (onlyFromList=true) Approved Rejected
-   **Valid values**:
    -   Approved
    -   Rejected

### approvalComment

-   **Purpose**: The comment entered as the reason for the approval or rejection.

### DocumentInfo:

### documentCompany

-   **Purpose**: The company the document was made at - as provided in Word properties.
-   **Example values**:
    -   WoodWing

### documentManager

-   **Purpose**: The manager of the document - as provided in Word properties.
-   **Example values**:
    -   John Doe

### numberOfPages

-   **Purpose**: Number of pages in the document.
-   **Example values**:
    -   4

### numberOfCharacters

-   **Purpose**: Number of characters in the document.
-   **Example values**:
    -   61069

### numberOfCharactersWithSpaces

-   **Purpose**: Number of characters in the document, including spaces.
-   **Example values**:
    -   71597

### numberOfLines

-   **Purpose**: Number of lines in the document.
-   **Example values**:
    -   1991

### numberOfParagraphs

-   **Purpose**: Number of paragraphs in the document.
-   **Example values**:
    -   994

## Version:

### versionNumber

-   **Purpose**: Version number for the current version.

## System:

### assetPath

-   **Purpose**: Full asset path, including file name.
-   **Example values**:
    -   /Some Zone/sub folder-A/sub folder-B/someasset.txt

### assetCreated

-   **Purpose**: Date when the asset was created is Assets Server.

### assetCreator

-   **Purpose**: Name of the user who imported the file into Assets Server.
-   **Example values**:
    -   admin
    -   JaneDoe

### assetModified

-   **Purpose**: Date and time when the asset was modified in some way in Assets Server. This includes Collections and files in Collections.

### assetModifier

-   **Purpose**: Name of the user who last modified the asset in some way.
-   **Example values**:
    -   editor001
    -   JohnDoe

### assetFileModified

-   **Purpose**: Date and time when the asset was checked-in or when a file in a Collection was modified.

### assetFileModifier

-   **Purpose**: User name of the person that last modified the file in Elvis.
-   **Example values**:
    -   editor001
    -   JohnDoe

### checkedOut

-   **Purpose**: Date when the asset was checked out.

### checkedOutBy

-   **Purpose**: Name of the user who checked out the asset.
-   **Example values**:
    -   admin
    -   JaneDoe

### lastModifiedCheckedOut

-   **Purpose**: Date when the file was updated locally.

### sharedAuthKeyIds

-   **Purpose**: Shared link IDs in which the asset is shared. This is set on assets to make them visible in the Shared link. Not set when the asset is shared through a Collection or folder.

### sharedAuthKeys

-   **Purpose**: Shared links in which the container or folder is shared. Each Shared link is represented as a small JSON object with the following fields: { authKey:"authKeyId", creator:"username", creatorName:"full name" } This is set on containers or folders to mark them as shared.

### shared

-   **Purpose**: Indicates that a container or folder is shared so the user can see that they are sharing files when adding them to the container or folder. <strong>predefinedValues</strong> (onlyFromList=true) true
-   **Valid values**:
    -   true

### parentContainerCount

-   **Purpose**: Number of containers of which the asset is part.

### id

-   **Purpose**: Unique asset GUID/UUID, assigned when the asset is added to the system. Search engine settings are ignored. Special handling in the server ensures the ID is never extracted, only embedded. A separate field 'firstExtractedId' contains the extracted value.
-   **Example values**:
    -   AhjnGHY64IZ8yk1Uyw8mk0

### textContent

-   **Purpose**: Plain-text content of file, for example the text from a PDF, DOC or RTF file. (Currently not used for images; in theory it could contain text from images by extracted text using OCR techniques).

## Analytics:

### viewCount

-   **Purpose**: Indicates how many times the asset was viewed.

### downloadCount

-   **Purpose**: Indicates how many times the asset was downloaded.

## Fitch Content:

### cf_CourseTitle

-   **Purpose**: The title of the course.
-   **Example values**:
    -   Advanced Certificate in Financial Modeling

### cf_AlternativeTitle

-   **Purpose**: Alternative title for the course.
-   **Example values**:
    -   Advanced Certificate in Financial Modeling

### cf_CourseDate

-   **Purpose**: Date of the course.
-   **Example values**:
    -   2024-01-01

### cf_Region

-   **Purpose**: Region of the course.
-   **Example values**:
    -   Americas
    -   APAC
    -   Europe
    -   International
    -   MEA

### cf_ProposalId

-   **Purpose**: Proposal ID of the course.
-   **Example values**:
    -   1234567890

### cf_ClientId

-   **Purpose**: Client ID of the course.
-   **Example values**:
    -   1234567890

### cf_TutorName

-   **Purpose**: Name of the tutor of the course.
-   **Example values**:
    -   John Doe

### cf_Programme

-   **Purpose**: Programme of the course.
-   **Example values**:
    -   Advanced Certificate in Financial Modeling

### cf_Certificate

-   **Purpose**: Certificate of the course.
-   **Example values**:
    -   Advanced Certificate in Financial Modeling (FL)
    -   ARM Certificate in Bank Analysis (FL)
    -   Certificate in Corporate Credit Analysis (FL)
    -   Certificate in Financial Modeling (FL)
    -   Certificate in Insurance Company Analysis (FL)
    -   Certificate in Leveraged Finance Analysis (FL)
    -   Certificate in Non-Bank Financial Institutions (FL)
    -   Certificate in Restructuring (FL)

### cf_Exam

-   **Purpose**: Exam of the course.
-   **Example values**:
    -   Advanced Global Securities Operations (AGSO)
    -   Asset Servicing
    -   CFA
    -   CQF
    -   CFA Level I
    -   CFA Level II
    -   CFA Level III

### cf_Version

-   **Purpose**: Version of the course.
-   **Example values**:
    -   1.0

### cf_Level

-   **Purpose**: Level of the course.
-   **Example values**:
    -   Introductory/Foundation
    -   Intermediate
    -   Advanced
    -   Masterclass
    -   Qualifying
    -   Level 1
    -   Level 2
    -   Level 3
    -   Level 4
    -   Certificate

### cf_Audience

-   **Purpose**: Audience of the course.
-   **Example values**:
    -   Apprentice
    -   Corporate and Commercial Banking
    -   CPD
    -   Global Functions
    -   Global Markets
    -   Graduate
    -   Graduate (Mixed)
    -   Intern
    -   Investment Banking and Corporate Finance
    -   Investment Management
    -   Pre-intern
    -   Quantitative Finance
    -   Wealth Management

### cf_Duration

-   **Purpose**: Duration of the course.
-   **Example values**:
    -   10 hours
    -   1 day
    -   1 week
    -   1 month
    -   1 year

### cf_Topics

-   **Purpose**: Topics of the course.
-   **Example values**:
    -   Risk Management
    -   Credit
    -   Equity
    -   Fixed Income
    -   Derivatives

### cf_DocumentType

-   **Purpose**: Document type of the course.
-   **Example values**:
    -   Answers
    -   Background reading
    -   Binder
    -   Book
    -   Case study
    -   Client proposal
    -   Confidential material
    -   Cover templates
    -   Debrief
    -   Exercise
    -   Glossary
    -   Graphics
    -   Handout
    -   Model Outline
    -   Pre-course work
    -   Proposal template
    -   Questions
    -   Reference
    -   Research material
    -   Rise PDF extract
    -   Sales collateral
    -   SCORM package
    -   Scripts
    -   Slides
    -   Spreadsheet
    -   Storyboards
    -   Storyline
    -   Study material
    -   Syllabus update summary
    -   Trainer's material
    -   Video transcript
    -   Videos
    -   Voiceover

### cf_Language

-   **Purpose**: Language of the course.
-   **Example values**:
    -   ar_AR [Arabic]
    -   de_DE [German]
    -   en_GB [English - British]
    -   en_US [English- American]
    -   es_ES [Spanish]
    -   fr_FR [French]
    -   it_IT [Italian]
    -   ja_JP [Japanese]
    -   zh_CN [Simplified Chinese]
    -   zh_TW [Traditional Chinese]

### cf_Status

-   **Purpose**: Status of the course.
-   **Example values**:
    -   Draft
    -   Material update
    -   Technical review
    -   With Content
    -   With Learning Mate
    -   With Straive
    -   Proof Review
    -   Correction
    -   Ready to publish
    -   Published
    -   Publish Failed
    -   EN updated requires translation
    -   Archived

### cf_DocumentDelivery

-   **Purpose**: Document delivery of the course.
-   **Example values**:
    -   Canvas
    -   Client Platform
    -   Cognition
    -   Delegate
    -   Digital
    -   Docebo
    -   ERP
    -   Print
    -   Recording
    -   SCORM
    -   Cloud

### cf_CourseDelivery

-   **Purpose**: Course delivery of the course.
-   **Example values**:
    -   Blended
    -   E-Learning
    -   In person
    -   Self-study
    -   Virtual

### cf_RestrictionsCommercial

-   **Purpose**: Restrictions commercial of the course.
-   **Example values**:
    -   Yes
    -   No

### cf_RestrictionsLegal

-   **Purpose**: Restrictions legal of the course.
-   **Example values**:
    -   Yes
    -   No

### cf_courseProduct

-   **Purpose**: Product of the course.
-   **Example values**:
    -   CFA
    -   CQF
    -   Credit
    -   Corporate Banking
    -   Data Analytics and AI
    -   Enterprise Risk Management
    -   ESG
    -   ESG Qualifications
    -   Financial Accounting
    -   Financial Markets
    -   Fitch Credit
    -   Investment Banking
    -   Professional Skills
    -   Quantitative Finance
    -   Regulatory Certifications
    -   Technology
    -   Trade Finance
    -   Treasury
    -   Wealth Management
    -   WM Qualifications

### cf_courseName

-   **Purpose**: Name of the course.
-   **Example values**:
    -   Advanced Certificate in Financial Modeling

### cf_courseReference

-   **Purpose**: Reference of the course.
-   **Example values**:
    -   1234567890

### cf_courseErpTicket

-   **Purpose**: Erp ticket of the course.
-   **Example values**:
    -   1234567890

### cf_courseJiraIssue

-   **Purpose**: Jira issue of the course.
-   **Example values**:
    -   1234567890

### cf_courseWorkflowType

-   **Purpose**: Workflow type of the course.
-   **Example values**:
    -   New
    -   Update

### cf_copiedFromTemplateId

-   **Purpose**: Copied from template id of the course.
-   **Example values**:
    -   1234567890

### cf_usedInCourses

-   **Purpose**: Used in courses of the course.
-   **Example values**:
    -   1234567890

### cf_brightCoveVideoID

-   **Purpose**: Brightcove video id of the course.
-   **Example values**:
    -   1234567890

### cf_brightCoveVideoURL

-   **Purpose**: Brightcove video url of the course.
-   **Example values**:
    -   https://www.brightcove.com/videos/1234567890

### cf_ErpPublishHistory

-   **Purpose**: Erp publish history of the course.
-   **Example values**:
    -   1234567890

### cf_CognitionPublishHistory

-   **Purpose**: Cognition publish history of the course.
-   **Example values**:
    -   1234567890

### cf_JiraPublishHistory

-   **Purpose**: Jira publish history of the course.
-   **Example values**:
    -   1234567890

### cf_SalesProductFocus

-   **Purpose**: Sales product focus of the course.
-   **Example values**:
    -   Credit
    -   CFA
    -   Corporate Banking
    -   CQF
    -   Data Analytics and AI
    -   Enterprise Risk Management
    -   ESG
    -   ESG Qualifications
    -   Financial Accounting
    -   Financial Markets
    -   Fitch Credit
    -   Investment Banking
    -   Professional Skills
    -   Quantitative Finance
    -   Regulatory Certifications
    -   Technology
    -   Trade Finance
    -   Treasury
    -   Wealth Management
    -   WM Qualifications

### cf_SalesSolutionType

-   **Purpose**: Sales solution type of the course.
-   **Example values**:
    -   E-Learning (Build)
    -   E-Learning (Deployment)
    -   Academy Curriculum Delivery
    -   Early Careers Training
    -   Certifications
    -   Consultancy
    -   Content Development
    -   Apprenticeships

### cf_PluginModifier

-   **Purpose**: Plugin modifier of the course.
-   **Example values**:
    -   jdoe

### cf_PluginModified

-   **Purpose**: Plugin modified of the course.
-   **Example values**:
    -   2024-01-01
