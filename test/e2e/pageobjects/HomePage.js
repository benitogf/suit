// @flow
import { By } from 'selenium-webdriver'
import BasePage from './BasePage'

const CONTENT = By.css('.content')
const HOME = By.css('.content .md-title')
const HEY = 'Apple'

export default class HomePage extends BasePage {

  async isLoaded () {
    await this.waitForDisplayed(CONTENT)
    await this.waitForTextToBe(HOME, HEY)
  }

}
