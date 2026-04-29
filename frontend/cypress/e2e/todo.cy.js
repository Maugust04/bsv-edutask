/**
 *  This is the file for testsing GUI 
 *  
 *  R8UC1 - Create todo
 *  TC-1: The user enters a description of a todo item into an empty input form field.
 *  TC-2: If the description is not empty and the user presses “Add”, the system creates a new todo item
 *  TC-2b: If the description is empty then the “Add” button should remain disabled.
 */
// cy.visit('http://localhost:3000')
describe('R8UC1 - Create Todo', () => {
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
        cy.visit('http://localhost:3000')
        cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email)
        cy.get('form').submit()
        cy.get('h1').should('contain.text', 'Your tasks')
        cy.get('.container-element a').first().click()
    })

    after(function () {
        cy.request({ method: 'DELETE', url: `http://localhost:5000/tasks/byid/${taskid}` })
        cy.request({ method: 'DELETE', url: `http://localhost:5000/users/${uid}` })
    })

    it('TC-1: The user enters a description into the input field', () => {
        cy.get('input[placeholder="Add a new todo item"]')
            .type('My new todo item')

        cy.get('input[placeholder="Add a new todo item"]')
            .should('have.value', 'My new todo item')
    })
})

    // it('TC-2: A new todo item is appended to the list when description is filled and Add is clicked', () => {
    //     // type a description
    //     cy.get('input[placeholder="Add a new todo item"]')
    //         .type('My new todo item')
        
    //     // click the Add button
    //     cy.get('input[type=submit][value="Add"]').click()

    //     // verify the new todo item appears in the list
    //     cy.get('.todo-list').should('contain.text', 'My new todo item')
    // })
/**
 *  R8UC2 - Toggle todo
 *  TC-3: The user clicks on the icon in front of the description of the todo item. 
 *  TC-4: If the todo item was previously active, it is set to done. 
 *  TC-4b:If the todo item was previously done, it is set to active. The toggled todo item is not struck through anymore
 */

// describe('Toggle Todo', () => {
//     beforeEach(function () {
//         // enter the main main page
//         cy.visit('http://localhost:3000')
//     })

//     it('TC - 3', () => {

//     })

//     it('TC - 4', () => {

//     })

//     it('TC - 4b', () => {

//     })

// })
/**
 *  R8UC3 - Delete todo
 *  TC-5: If user clicks on the x symbol behind the description of the todo item, the todo item is deleted 
 */


// describe('Delete Todo', () => {
//     beforeEach(function () {
//         // enter the main main page
//         cy.visit('http://localhost:3000')
//     })

//     it('TC - 5', () => {

//     })
// })