
Feature('tink');

Before((I) => {
    // 1 пункт. Переходом по адресу https://www.tinkoff.ru/ загрузить стартовую страницу Tinkoff Bank.
    I.amOnPage('https://www.tinkoff.ru');
    //Before тут использовать сомнительно, просто для пробы возможностей инструмента
});

// Для чернового работающего варианта делаем все в одном сценарии
Scenario('test something @tink', async (I) => {
    // 2 пункт. Из меню в футере, нажатием на пункт меню “Платежи“, перейти на страницу “Платежи“.
    I.seeElement('footer[class^="footer"]');
	await I.clickLink('Платежи', 'footer[class^="footer"]');
	/////////////////////////////////////////////////////////////////////////////////////////////

    // 3 пункт. В списке категорий платежей, нажатием на пункт “ЖКХ“, перейти на страницу выбора поставщиков услуг.
    await I.waitForElement('div[data-qa-file="PaymentsPage"]',30);
    await I.clickLink('ЖКХ','div[data-qa-file="PaymentsPage"]');
    /////////////////////////////////////////////////////////////////////////////////////////////

    // 4 пункт. Убедиться, что текущий регион – “Москва” (в противном случае выбрать регион “Москва” из списка регионов).
    await I.waitForElement('span[data-qa-file="PaymentsCatalogHeader"]');
    var regionCurrent = null;
    var regionMoscow = 'Москве';
    regionCurrent = await I.grabTextFrom('span[data-qa-file="PaymentsCatalogHeader"] span');
    console.log(regionMoscow.localeCompare(regionCurrent));
    if (regionMoscow.localeCompare(regionCurrent)) {
        await I.clickLink('span[data-qa-file="PaymentsCatalogHeader"] span');
        await I.waitForElement('div[data-qa-file="UIPopupRegionsAsync"]',30);
        await I.clickLink('Москва','div[data-qa-file="UIPopupRegionsAsync"] span[data-qa-file="UILink"]');
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 5 пункт. Со страницы выбора поставщиков услуг, выбрать 1-ый из списка (Должен быть “ЖКУ-Москва”).
    // Сохранить его наименование (далее “искомый”) и нажатием на соответствующий элемент перейти на страницу оплаты “ЖКУ-Москва“.
    await I.waitForElement('ul[data-qa-file="UIScrollList"] li:first-child',30);
    var target = await I.grabTextFrom('ul[data-qa-file="UIScrollList"] li:first-child');
    console.log(target);
    I.wait(1);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 6 пункт. На странице оплаты, перейти на вкладку “Оплатить ЖКУ в Москве“.
    await I.clickLink(target,'ul[data-qa-file="UIScrollList"] li:first-child');
    await I.waitForElement('div[data-qa-file="Tabs"]', 30);
    await I.clickLink('Оплатить ЖКУ в Москве', 'div[data-qa-file="Tabs"]');
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 7 пункт. Выполнить проверки на невалидные значения для обязательных полей: проверить все текстовые сообщения об ошибке (и их содержимое),
    // которые появляются под соответствующим полем ввода в результате ввода некорректных данных.
    /*Проверка обработки невалидных данных для кода плательщика - поле является обязательным*/
    //Сценарий: пустое поле
    await I.waitForElement('label[for="payerCode"]', 30);
    await I.fillField('label[for="payerCode"]',' ');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[1]/div/div[2]', 30);
    await I.see('Поле обязательное', '//form[@class="ui-form"]/div[1]/div/div[2]');
    //Сценарий: неккоректный код плательщика - должен быть десятизначным
    await I.fillField('label[for="payerCode"]','123456789');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[1]/div/div[2]', 30);
    await I.see('Поле неправильно заполнено', '//form[@class="ui-form"]/div[1]/div/div[2]');
    /*Проверка обработки невалидных данных для поля даты - поле является обязательным*/
    //Сценарий: пустое поле
    await I.waitForElement('label[for="period"]', 30);
    await I.fillField('label[for="period"]',' ');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[1]/div/div[2]', 30);
    await I.see('Поле обязательное', '//form[@class="ui-form"]/div[2]/div/div[2]');
    //Сценарий: некорректная дата - год должен быть в формате YYYY
    await I.waitForElement('label[for="period"]', 30);
    await I.fillField('label[for="period"]','12.123');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[1]/div/div[2]', 30);
    await I.see('Поле заполнено некорректно', '//form[@class="ui-form"]/div[2]/div/div[2]');
    /*Проверка обработки невалидных данных для поля суммы страхования - поле НЕ является обязательным*/
    await I.waitForElement('//form[@class="ui-form"]/div[3]/div/div/label/div/input', 30);
    I.clearField('//form[@class="ui-form"]/div[3]/div/div/label/div/input');
    await I.fillField('//form[@class="ui-form"]/div[3]/div/div/label/div/input','-2');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[3]/div/div[2]', 30);
    await I.see('Поле заполнено неверно', '//form[@class="ui-form"]/div[3]/div/div[2]');
    /*Проверка обработки невалидных данных для поля суммы платежа - поле является обязательным*/
    //Сценарий: пустое поле
    await I.waitForElement('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div/label/div/input', 30);
    await I.fillField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div/label/div/input','');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]', 30);
    await I.see('Поле обязательное', '//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]');
    //Сценарий: вводим некорректную сумму (в данном случае отрицательную)
    await I.fillField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[1]/label/div/input','-25');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]', 30);
    await I.see('Поле заполнено неверно', '//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]');
    //Сценарий: сумма платежа меньше минимальной
    I.clearField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[1]/label/div/input');
    await I.fillField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[1]/label/div/input','1');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]', 30);
    await I.see('Минимум — 10 ₽', '//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]');
    // Сценарий: превышение максимальной суммы платежа
    I.clearField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[1]/label/div/input');
    await I.fillField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[1]/label/div/input','15100');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]', 30);
    await I.see('Максимум — 15\u00A0000 ₽', '//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[2]');
    /*Обработка невалидных данных с задействованием двух полей - суммы страхования и суммы платежа*/
    // Сценарий: сумма страхования больше суммы платежа - показывается ошибка в третьем поле
    await I.waitForElement('//form[@class="ui-form"]/div[3]/div/div/label/div/input', 30);
    I.clearField('//form[@class="ui-form"]/div[3]/div/div/label/div/input');
    await I.fillField('//form[@class="ui-form"]/div[3]/div/div/label/div/input','200');
    await I.waitForElement('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div/label/div/input', 30);
    I.clearField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[1]/label/div/input');
    await I.fillField('//form[@class="ui-form"]/div[4]/div/div/div/div/div/div/div/div[1]/label/div/input','100');
    await I.click('div[data-qa-file="SubscriptionProvider"]');
    I.wait(1);
    await I.waitForElement('//form[@class="ui-form"]/div[3]/div/div[2]', 30);
    await I.see('Сумма добровольного страхования не может быть больше итоговой суммы.', '//form[@class="ui-form"]/div[3]/div/div[2]');
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 8 пункт. Повторить шаг (2).
    await I.click('//footer/div[2]/div/div[2]/div[2]/ul/li[2]/a/span[2]');
    await I.see('Платежи','footer[class^="footer"]');
    await I.clickLink('Платежи', 'footer[class^="footer"]');
    await I.waitForElement('div[data-qa-file="PaymentsPage"]',30);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 9 пункт. В строке быстрого поиска поставщика услуг ввести наименование искомого (ранее сохраненного).
    await I.waitForElement('div[data-qa-file="FormFieldSearchAndPay"]');
    await I.fillField('//div[@data-qa-file="FormFieldSearchAndPay"]/div/div/label/div/input',target);
    await I.click('//div[@data-qa-file="FormFieldSearchAndPay"]/div/div/label/div/input');
    I.wait(1);
    I.saveScreenshot('suggest.png', true);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 10 пункт. Убедиться, что в списке предложенных провайдеров искомый поставщик первый.
});
