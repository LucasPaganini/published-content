describe('End to end testing example', () => {
	it('should have the correct title', () => {
		cy.visit('/');
		const fruits = ['Apple', 'Watermelon', 'Banana', 'Peach', 'Orange'];

		cy.get('.title').should('contain', 'Fruits');
		fruits.forEach(fruit => {
			cy.get('.fruits li').should('contain', fruit);
		});
	});
});
