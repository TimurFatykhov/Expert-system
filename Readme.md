# Expert system
## **get** request: list of questions
```
type: 'GET',
url: '/list_of_questions',
```

## **post** request: array of answers
```
type: 'POST',
url: '/answers',
data: answers,
```
`answer` - array with comparisons.
Response contains array with matrix's elements
