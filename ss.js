
Feature('tink_test');

Before((I) => { // or Background
    I.amOnPage('https://www.tinkoff.ru');
});

Scenario('test something @tink', (I) => {
    I.click('Платежи', {css: 'footer'});
    pause();
});
