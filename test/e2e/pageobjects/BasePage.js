// @flow
import { until } from 'selenium-webdriver'

async function waitForText (driver: WebDriverClass, locator: WebDriverLocator, text: string, retries?: number = 300): Promise<void> {
  let states = ''
  try {
    const element = await driver.findElement(locator)
    states += element.getText()
    await driver.wait(until.elementTextIs(element, text), 7000)
  } catch (err) {
    if (retries === 0) {
      throw new Error(`Element ${locator.toString()} text still not equal to: "${text}", found: "${states}", after maximum retries, Error message: ${err.message.toString()}`)
    }
    await driver.sleep(50)
    return waitForText(driver, locator, text, retries - 1)
  }
}

async function waitForLocated (driver: WebDriverClass, locator: WebDriverLocator, retries?: number = 3): Promise<void> {
  try {
    await driver.wait(until.elementLocated(locator), 7000)
  } catch (err) {
    if (retries === 0) {
      throw new Error(`Still not able to locate element ${locator.toString()} after maximum retries, Error message: ${err.message.toString()}`)
    }
    await driver.sleep(250)
    return waitForLocated(driver, locator, retries - 1)
  }
}

async function waitForVisible (driver: WebDriverClass, locator: WebDriverLocator, retries?: number = 3): Promise<void> {
  try {
    const element = await driver.findElement(locator)
    await driver.wait(until.elementIsVisible(element), 7000)
  } catch (err) {
    if (retries === 0) {
      throw new Error(`Element ${locator.toString()} still not visible after maximum retries, Error message: ${err.message.toString()}`)
    }
    await driver.sleep(250)
    return waitForVisible(driver, locator, retries - 1)
  }
}

export default class BasePage {
  driver: WebDriverClass

  constructor (webdriver: WebDriverClass) {
    this.driver = webdriver
  }

  async waitForDisplayed (locator: WebDriverLocator, retries?: number = 3): Promise<WebDriverElement> {
    await waitForLocated(this.driver, locator, retries)
    await waitForVisible(this.driver, locator, retries)
    return this.driver.findElement(locator)
  }

  async waitForTextToBe (locator: WebDriverLocator, text: string, retries?: number = 300): Promise<WebDriverElement> {
    await waitForText(this.driver, locator, text, retries)
    return this.driver.findElement(locator)
  }

  async sendKeys (locator: WebDriverLocator, keys: string, retries?: number = 1): Promise<void> {
    try {
      const element = await this.driver.findElement(locator)
      await element.click()
      await element.clear()
      return element.sendKeys(keys)
    } catch (err) {
      if (retries === 0) {
        throw new Error(`Unable to send keys to ${locator.toString()} after maximum retries, error : ${err.message}`)
      }
      await this.driver.sleep(250)
      return this.sendKeys(locator, keys, retries - 1)
    }
  }

  async getText (locator: WebDriverLocator, retries?: number = 1): Promise<string> {
    try {
      const element = await this.driver.findElement(locator)
      const text = await element.getText()
      return text.trim()
    } catch (err) {
      if (retries === 0) {
        throw new Error(`Unable to get ${locator.toString()} text after maximum retries, error : ${err.message}`)
      }
      await this.driver.sleep(250)
      return this.getText(locator, retries - 1)
    }
  }

  async click (locator: WebDriverLocator, retries?: number = 1) {
    try {
      const element = await this.driver.findElement(locator)
      await element.click()
      return
    } catch (err) {
      if (retries === 0) {
        throw new Error(`Still not able to click ${locator.toString()} after maximum retries, Error message: ${err.message.toString()}`)
      }
      await this.driver.sleep(250)
      return this.click(locator, retries - 1)
    }
  }

  async refresh (locator: WebDriverLocator, retries?: number = 3): Promise<WebDriverElement> {
    // await this.driver.sleep(1700)
    await this.driver.get(this.driver.getCurrentUrl())
    await waitForLocated(this.driver, locator, retries)
    await waitForVisible(this.driver, locator, retries)
    return this.driver.findElement(locator)
  }

}
