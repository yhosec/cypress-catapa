describe('reimbursement parking spec', () => {
  it('passes', () => {
    cy.visit('https://ess.catapa.com/dashboard/menu/reimbursement/request')
    cy.get('#displayName').type(Cypress.env('company'))
    cy.get('.btn-primary').click()
    cy.wait(100)

    cy.get('input[name="username"]').type(Cypress.env('username'))
    cy.get('input[name="password"]').type(Cypress.env('password'))
    cy.get('.btn-primary').click()
    cy.wait(100)

    let path = 'cypress/fixtures/parking'
    let uploadedPath = 'cypress/fixtures/uploaded'
    cy.fsReadDir(path).then((userFixture) => {
      userFixture.forEach(f => {

        if (!f.startsWith('parking#')) {
          return;
        }

        let fn = f.split(".")
        if (fn.length == 0) {
          return;
        }

        let fc = fn[0].split("#")
        if (fc.length == 0) {
          return;
        }

        // Click btn tambah pengajuan
        cy.get('.btn-page-action').click()
        cy.wait(100)

        // item
        cy.get('#reimbursement-entry-form-item').click()
        cy.get('#reimbursement-entry-form-item > .ng-select-container > .ng-value-container > .ng-input > input').type('park')
        cy.get('#reimbursement-entry-form-item > .ng-dropdown-panel > .ng-dropdown-panel-items > div > .ng-option').click()
        cy.wait(50)

        // upload file
        let oldPath = path + '/' + f
        cy.get('input[type=file]').selectFile({ contents: oldPath }, { force: true })
        cy.wait(100)

        // date
        cy.get('#reimbursement-entry-form-receipt-date').click()
        cy.wait(100)

        let sDate = fc[1];
        let y = sDate.substring(0, 4)
        let m = sDate.substring(4, 6)
        let d = sDate.substring(6, 8)
        
        let diffYear = new Date().getFullYear()- parseInt(y)
        let diffMonth = (diffYear*12) + (new Date().getMonth()+1 - parseInt(m))

        for (let index = 0; index < diffMonth; index++) {
          cy.get('.bs-datepicker-head > bs-datepicker-navigation-view > button.previous').click()
          cy.wait(100)
        }
        cy.contains('td.ng-star-inserted > span:not(.is-other-month)', parseInt(d)).click()
        cy.wait(100)


        // amount
        let amount = fc[2];
        cy.get('#reimbursement-entry-form-claimed-amount').type(amount)


        // category
        cy.get('#reimbursement-entry-form-category > .ng-select-container > .ng-value-container > .ng-input > input').type('motor')
        cy.get('#reimbursement-entry-form-category > .ng-dropdown-panel > .ng-dropdown-panel-items > div > .ng-option').click()


        // submit
        cy.get('#reimbursement-entry-form-save').click()
        cy.wait(100)
        

        // Move file
        let newPath = uploadedPath + '/' + f
        cy.fsCopyFile({
          path: oldPath, 
          newPath: newPath,
          mode: 1
        })
        cy.fsDeleteFile(oldPath)
        cy.wait(500)
      });
    })

  })
})