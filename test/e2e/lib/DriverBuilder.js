// @flow
import webdriver from 'selenium-webdriver'

export default class DriverBuilder {
  driver: WebDriverClass

  constructor (browser) {
    const builder = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub')
    // $FlowIssue getting chrome capabilities as method is a-ok
    const capabilities = webdriver.Capabilities[browser]()
    builder.withCapabilities(capabilities)
    this.driver = builder.build()
  }

  async quit (): Promise<void> {
    return this.driver.quit()
  }

}
