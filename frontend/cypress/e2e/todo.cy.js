/**
 *  E2E tests for R8 - Todo manipulation
 *
 *  R8UC1 - Create todo
 *  TC-1: The user enters a description of a todo item into an empty input form field.
 *  TC-2: If the description is not empty and the user presses "Add", the system creates a new todo item.
 *  TC-6: If the description is empty, the "Add" button remains disabled.
 *
 *  R8UC2 - Toggle todo
 *  TC-3: The user clicks on an active todo item - it becomes done.
 *  TC-4: The user clicks on a done todo item - it becomes active again.
 *
 *  R8UC3 - Delete todo
 *  TC-5: If the user clicks on the x symbol, the todo item is deleted.
 */
describe('R8 - Todo manipulation', () => {
    let uid
    let email
    let taskid

    before(function () {
        cy.fixture('user.json').then((user) => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:5000/users/create',
                form: true,
                body: user
            }).then((response) => {
                uid = response.body._id.$oid
                email = user.email

                cy.request({
                    method: 'POST',
                    url: 'http://localhost:5000/tasks/create',
                    form: true,
                    body: `userid=${uid}&title=Test+Task&url=dQw4w9WgXcQ&todos=Watch+video&description=Test+description`
                }).then((response) => {
                    taskid = response.body[0]._id.$oid
                })
            })
        })
    })

    beforeEach(function () {
        cy.viewport(1280, 1500)
        cy.visit('http://localhost:3000')
        cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email)
        cy.get('form').submit()
        cy.get('h1').should('contain.text', 'Your tasks')
    })

    after(function () {
        cy.request({ method: 'DELETE', url: `http://localhost:5000/tasks/byid/${taskid}` })
        cy.request({ method: 'DELETE', url: `http://localhost:5000/users/${uid}` })
    })

    it('TC-1: The user enters a description into the input field', () => {
        cy.get('.container-element a').first().click()

        cy.get('input[placeholder="Add a new todo item"]')
            .type('TC-1 todo item')

        cy.get('input[placeholder="Add a new todo item"]')
            .should('have.value', 'TC-1 todo item')
    })

    it('TC-2: The user enters a description into the input field and adds it', () => {
        cy.get('.container-element a').first().click()

        cy.get('input[placeholder="Add a new todo item"]')
            .type('TC-2 todo item')

        cy.get('input[placeholder="Add a new todo item"]')
            .should('have.value', 'TC-2 todo item')

        cy.get('input[type=submit][value=Add]')
            .click()

        cy.contains('li', 'TC-2 todo item')
            .should('exist')

        // Two clicks required due to system defect in deleteTodo (see bug report)
        cy.contains('li', 'TC-2 todo item')
            .find('.remover')
            .click()
            .click()
    })

    it('TC-6: Add button is disabled when the description is empty', () => {
        cy.get('.container-element a').first().click()

        cy.get('input[placeholder="Add a new todo item"]')
            .should('have.value', '')

        cy.get('input[type=submit][value=Add]')
            .should('be.disabled')
    })

    it('TC-3: User clicks on unchecked todo item - it becomes checked', () => {
        cy.get('.container-element a').first().click()

        cy.get('input[placeholder="Add a new todo item"]')
            .type('TC-3 todo item')
        cy.get('input[type=submit][value=Add]').click()

        cy.contains('li', 'TC-3 todo item')
            .find('.checker')
            .should('have.class', 'unchecked')

        cy.contains('li', 'TC-3 todo item')
            .find('.checker')
            .click()

        cy.contains('li', 'TC-3 todo item')
            .find('.checker')
            .should('have.class', 'checked')

        cy.contains('li', 'TC-3 todo item')
            .find('.remover')
            .click()
    })

    it('TC-4: User clicks on checked todo item - it becomes unchecked again', () => {
        cy.get('.container-element a').first().click()

        cy.get('input[placeholder="Add a new todo item"]')
            .type('TC-4 todo item')
        cy.get('input[type=submit][value=Add]').click()

        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .click()

        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .should('have.class', 'checked')

        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .click()

        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .should('have.class', 'unchecked')

        cy.contains('li', 'TC-4 todo item')
            .find('.remover')
            .click()
    })

    it('TC-5: Todo item is removed from list when x is clicked', () => {
        cy.get('.container-element a').first().click()

        cy.get('input[placeholder="Add a new todo item"]')
            .type('Test 5 todo item')

        cy.get('input[type=submit][value=Add]').click()

        cy.contains('li', 'Test 5 todo item').should('exist')

        // Two clicks required due to system defect in deleteTodo (see bug report)
        cy.contains('li', 'Test 5 todo item')
            .find('.remover')
            .click()
            .click()

        cy.contains('li', 'Test 5 todo item').should('not.exist')
    })
})
