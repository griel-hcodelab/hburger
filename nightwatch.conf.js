const seleniumServer = require("selenium-server")
const chromeDriver = require("chromedriver")

module.exports = {

    src_folders: [
        "tests",
    ],

    selenium: {
        start_process: true,
        start_session: false,
        server_path: seleniumServer.path,
        check_process_delay: 5000,
        host: "127.0.0.1",
        port: 4444,
        cli_args: {
            "webdriver.chrome.driver": chromeDriver.path
        }
    }, 
    test_settings: {
        default: {
            desiredCapabilities: {
                browserName: "chrome"
            }
        }, 
        chrome: {
            desiredCapabilities: {
                browserName: "chrome",
                javascripitEnable: true,
                acceptSslCerts: true,
                chromeOptions: {
                    w3c: false,
                    args: ['disable-gpu']
                }
            }
        },
        headlessChrome: {
            desiredCapabilities: {
                browserName: "chrome",
                javascripitEnable: true,
                acceptSslCerts: true,
                chromeOptions: {
                    w3c: false,
                    args: ['disale-gpu', 'headless']
                }
            }
        }
    }
}