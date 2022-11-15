# xepelin-scrapper

## How to run
 
 1. yarn install
 2. yarn start

## Api y scrapper

- curl -X POST http://127.0.0.1:3000/getArticlesOfCategory -d '{"category": "Emprendedores","webhook": "https://hooks.zapier.com/hooks/catch/11217441/bfemddr"}' -H 'Content-Type: application/json'

- curl -X POST http://127.0.0.1:3000/getAllArticles -d '{"webhook": "https://hooks.zapier.com/hooks/catch/11217441/bfemddr"}' -H 'Content-Type: application/json'


- https://docs.google.com/spreadsheets/d/1B66yG75efaAixmUB6Gtu_nCNUmyujDbpaD4PoEb8SdA/edit#gid=1084842889
