Report Builder
==============

Install
-------

- Install dependencies
    - NodeJS
- `npm install`
- `tsd install`

Run
---

Note, we currently require the data files to the in the form `hrsc-2004.csv` where `2004` is the company id.

####Single report

    node src/index.js --globalNorms ~/Desktop/global-norms.csv --industryNorms ~/Desktop/industry-norms.csv --config ~/Desktop/report-config.json --dataDir ~/Desktop/csv-data --destDir ~/Desktop/pdf-output --industryCodes ~/Desktop/industry-codes.csv

####Directory

    node src/run-dir.js --globalNorms ~/Desktop/global-norms.csv --industryNorms ~/Desktop/industry-norms.csv --config ~/Desktop/new-report-config.json --dataDir ~/Desktop/csv-data --destDir ~/Desktop/pdf-output --industryCodes ~/Desktop/industry-codes.csv

Develop
-------

- Install dependencies
    - TypeScript

Sample Config
------

```
{
    "header": "This is the report header",
    "description" : "This is a description of the report",
    "sections": [
        {
            "header": "This is the label for the section",
            "questions": [
                {
                    "id": "question1",  //the label for the column in the data.csv
                    "description": "This is the question description",
                    "scale": 5,
                    "industryNorm":4,
                    "globalNorm":3
                },
                {
                    "id": "question2",
                    "description": "This is the question description",
                    "scale": 5,
                    "industryNorm":4.5,
                    "globalNorm":3
                },
                {
                    "id": "question3",
                    "description": "This is the question description",
                    "scale": 5,
                    "industryNorm":2,
                    "globalNorm":3.5
                }
            ]
        },
        {
            "header": "Another section",
            "questions": [
                {
                    "id": "question4",
                    "description": "This is the question description",
                    "scale": 5,
                    "industryNorm":3,
                    "globalNorm":3
                },
                {
                    "id": "question5",
                    "description": "This is the question description",
                    "scale": 5,
                    "industryNorm":3,
                    "globalNorm":3
                }
            ]
        }
    ]
}
```