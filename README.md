# cypress-catapa
Automation Catapa

## Setup
* Change env file `example.cypress.env.json` to `cypress.env.json`
* Update `cypress.env.json` file with your credential

## Add your rimbursement file
* Add file to folder `parking` with file name format `parking#{date with format *yyyymmdd*}#{amount}.jpg`
* Run automation `parkingspec.cy`

## Run Automation 
`npm run e2e:chrome --spec "cypress/e2e/parkingspec.cy.js"`
`npx cypress open`

