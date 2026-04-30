/**
 *  This is the file for testsing GUI 
 *  
 *  R8UC1 - Create todo
 *  TC-1: The user enters a description of a todo item into an empty input form field.
 *  TC-2: If the description is not empty and the user presses “Add”, the system creates a new todo item
 */
// cy.visit('http://localhost:3000')
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
        cy.visit('http://localhost:3000')                   // open the app
        cy.contains('div', 'Email Address')                 // find email input and type
            .find('input[type=text]')
            .type(email)
        cy.get('form').submit()                             // Login
        cy.get('h1').should('contain.text', 'Your tasks')   //wait until the page is loaded
    })

    after(function () { // Removes the addded user after the test is done
        cy.request({ method: 'DELETE', url: `http://localhost:5000/tasks/byid/${taskid}` })
        cy.request({ method: 'DELETE', url: `http://localhost:5000/users/${uid}` })
    })

    it('TC-1: The user enters a description into the input field', () => {
        cy.get('.container-element a').first().click() //open detail view

        cy.get('input[placeholder="Add a new todo item"]')
            .type('TC-1 todo item')
            
        cy.get('input[placeholder="Add a new todo item"]')
            .should('have.value', 'TC-1 todo item')
    })

    it('TC-2: The user enters a description into the input field and adds it', () => {
        cy.get('.container-element a').first().click() //open detail view

        cy.get('input[placeholder="Add a new todo item"]') // find the description input field and type
            .type('TC-2 todo item')
            
        cy.get('input[placeholder="Add a new todo item"]') // assert that the description input field contains the text we typed
            .should('have.value', 'TC-2 todo item')

        cy.get('input[type=submit][value=Add]') // find the add button and click
            .click()

        cy.contains('li', 'TC-2 todo item') // assert that a new todo item with the description we typed is now in the list of todo items
            .should('exist')

        // I wanted to do a before each to rince it all but i dont know how to get it to work
        // so for the sake of this assignment i did it like this.
        cy.contains('li', 'TC-2 todo item')
            .find('.remover')
            .click()
            .click() // Read Bug report On assigment 2
        
    })

/**
 *  R8UC2 - Toggle todo
 *  TC-3: The user clicks on the icon in front of the description of the todo item. 
 *  TC-4: If the todo item was previously active, it is set to done.
 */
// TC-3: Toggle from active to done
    it('TC-3: User clicks on unchecked todo item - it becomes checked', () => {
        cy.get('.container-element a').first().click()
        
        cy.get('input[placeholder="Add a new todo item"]')
            .type('TC-3 todo item')
        cy.get('input[type=submit][value=Add]').click()
        
        // Verify unchecked initially
        cy.contains('li', 'TC-3 todo item')
            .find('.checker')
            .should('have.class', 'unchecked')
        
        // Click to check
        cy.contains('li', 'TC-3 todo item')
            .find('.checker')
            .click()
        
        // Verify becomes checked
        cy.contains('li', 'TC-3 todo item')
            .find('.checker')
            .should('have.class', 'checked')

        cy.contains('li', 'TC-3 todo item')
            .find('.remover')
            .click()
    })

    // TC-4: Toggle from done back to active
    it('TC-4: User clicks on checked todo item - it becomes unchecked again', () => {
        cy.get('.container-element a').first().click()
        
        // Add and check a todo first
        cy.get('input[placeholder="Add a new todo item"]')
            .type('TC-4 todo item')
        cy.get('input[type=submit][value=Add]').click()
        
        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .click()  // Check it
        
        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .should('have.class', 'checked')
        
        // Now click again to uncheck (toggle back)
        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .click()
        
        // Verify becomes unchecked again
        cy.contains('li', 'TC-4 todo item')
            .find('.checker')
            .should('have.class', 'unchecked')

        // Bug here there is no bug 
        cy.contains('li', 'TC-4 todo item')
            .find('.remover')
            .click()
    })

// })
/**
 *  R8UC3 - Delete todo
 *  TC-5: If user clicks on the x symbol behind the description of the todo item, the todo item is deleted 
 */
    it('TC-5: Todo item is removed from list when x is clicked', () => {
        cy.get('.container-element a').first().click()

        cy.get('input[placeholder="Add a new todo item"]')
            .type('Test 5 todo item')

        cy.get('input[type=submit][value=Add]').click()
        
        cy.contains('li', 'Test 5 todo item').should('exist')

        cy.contains('li', 'Test 5 todo item')
            .find('.remover')
            .click()
            .click() // Read Bug report On assigment 2
        
        // Check for non-existence - might still fail if the delete didn't work
        cy.contains('li', 'Test 5 todo item').should('not.exist')
    })
})