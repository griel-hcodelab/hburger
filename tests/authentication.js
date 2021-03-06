const faker = require('faker')

const name = faker.name.firstName() + ' ' + faker.name.middleName() + ' ' + faker.name.lastName()
const email = faker.internet.email().toLowerCase()
const password = faker.internet.password()

module.exports = {
    "Acessando a página de autenticação": function(browser) {
        browser
                .url('http://localhost:8080/')
                .waitForElementVisible('body')
                .assert.visible('#form-tabs > li:nth-child(2) > a')
                .click('#form-tabs > li:nth-child(2) > a')
                .pause(2000)
    },
    "Cadastrando um usuario": function(browser) {
        browser
                .waitForElementVisible('body')
                .setValue("[name=name]", name)
                .setValue("[name=email]", email)
                .setValue("[name=password]", password)
                .saveScreenshot('./tests/screenshots/cadastros.png')
                .assert.visible('#form-register > footer > button')
                .click('#form-register > footer > button')
                .pause(2000)
                .end()
    }
    

}