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

    node src/index.js --config /path/to/config.json --data /path/to/data.csv --dest /path/to/destination.pdf

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