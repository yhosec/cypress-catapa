describe('reimbursement parking spec', () => {
  it('passes', () => {
    const pathFolder = 'cypress/fixtures/parking';
    const uploadedPathFolder = 'cypress/fixtures/uploaded';

    cy.visit('https://accounts-apps.catapa.com/company?continue=https:%2F%2Fess.catapa.com%2Fdashboard%2Fmenu%2Freimbursement%2Frequest');
    cy.wait(1000);
    cy.get('#displayName').type('TIKETDOTCOM');
    cy.get('.btn-primary').click();
    cy.wait(1000);

    cy.get('input[name="username"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('.btn-primary').click(); // redirect ke https://ess.catapa.com/dashboard/menu/reimbursement/request
    cy.wait(5000);

    // Baca list file sebelum masuk cy.origin
    cy.task('readDir', pathFolder).then((files) => {
      files.forEach((f) => {
        if (!f.startsWith('parking#')) return;

        const fn = f.split('.');
        if (fn.length === 0) return;

        const fc = fn[0].split('#');
        if (fc.length === 0) return;

        const oldPath = `${pathFolder}/${f}`;
        const relPath = `parking/${f}`;

        // Baca file sebagai base64 di context utama
        cy.readFile(oldPath, 'base64').then((fileContent) => {
          cy.origin('https://ess.catapa.com', { args: { f, fc, fileContent, relPath, uploadedPathFolder } },
            ({ f, fc, fileContent, relPath, uploadedPathFolder }) => {

              // Klik tombol tambah pengajuan
              cy.get('a[href="/dashboard/menu/reimbursement/request/add"]')
                .should('be.visible')
                .click();
              cy.wait(500);

              // Pilih item
              cy.get('#reimbursement-entry-form-item').click();
              cy.get('#reimbursement-entry-form-item > .ng-select-container > .ng-value-container > .ng-input > input')
                .type('park');
              cy.get('#reimbursement-entry-form-item > .ng-dropdown-panel > .ng-dropdown-panel-items > div > .ng-option')
                .click();
              cy.wait(250);

              // Upload file dari base64
              cy.get('input[type=file]').selectFile({
                contents: Cypress.Buffer.from(fileContent, 'base64'),
                fileName: f
              }, { force: true });
              cy.wait(500);

              // Pilih tanggal
              cy.get('#reimbursement-entry-form-receipt-date').click();
              cy.wait(500);

              const sDate = fc[1];
              const y = sDate.substring(0, 4);
              const m = sDate.substring(4, 6);
              const d = sDate.substring(6, 8);

              const diffYear = new Date().getFullYear() - parseInt(y);
              const diffMonth = (diffYear * 12) + (new Date().getMonth() + 1 - parseInt(m));

              for (let index = 0; index < diffMonth; index++) {
                cy.get('.bs-datepicker-head > bs-datepicker-navigation-view > button.previous').click();
                cy.wait(500);
              }
              cy.contains('td.ng-star-inserted > span:not(.is-other-month)', parseInt(d)).click();
              cy.wait(500);

              // Amount
              const amount = fc[2];
              cy.get('#reimbursement-entry-form-claimed-amount').type(amount);

              // Category
              cy.get('#reimbursement-entry-form-category > .ng-select-container > .ng-value-container > .ng-input > input')
                .type('motor');
              cy.get('#reimbursement-entry-form-category > .ng-dropdown-panel > .ng-dropdown-panel-items > div > .ng-option')
                .click();

              // Submit
              cy.get('#reimbursement-entry-form-save').click();
              cy.wait(500);

              // Copy dan hapus file via task (harus dari context utama)
              cy.task('copyFile', { path: `cypress/fixtures/${relPath}`, newPath: `${uploadedPathFolder}/${f}` });
              cy.task('deleteFile', `cypress/fixtures/${relPath}`);
              cy.wait(1500);
            });
        });
      });
    });
  });
});
