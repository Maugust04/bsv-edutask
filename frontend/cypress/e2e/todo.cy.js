/**
 *  This is the file for testsing GUI 
 *  
 *  R8UC1 - Create todo
 *  TC-1: The user enters a description of a todo item into an empty input form field.
 *  TC-2: If the description is not empty and the user presses “Add”, the system creates a new todo item
 */

describe('Create Todo', () => {
    beforeEach(function () {
        // enter the main main page
        cy.visit('http://localhost:3000')
    })

    it('TC - 1', () => {

    })

    it('TC - 2', () => {

    })
})

/**
 *  R8UC2 - Toggle todo
 *  TC-3: The user clicks on the icon in front of the description of the todo item. 
 *  TC-4: If the todo item was previously active, it is set to done. 
 */

describe('Toggle Todo', () => {
    beforeEach(function () {
        // enter the main main page
        cy.visit('http://localhost:3000')
    })

    it('TC - 3', () => {

    })

    it('TC - 4', () => {

    })

})
/**
 *  R8UC3 - Delete todo
 *  TC-5: If user clicks on the x symbol behind the description of the todo item, the todo item is deleted 
 */


describe('Delete Todo', () => {
    beforeEach(function () {
        // enter the main main page
        cy.visit('http://localhost:3000')
    })

    it('TC - 5', () => {

    })
})