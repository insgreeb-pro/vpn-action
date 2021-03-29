const core = require("@actions/core")
const fs = require("fs")
const https = require("https")
const shell = require("shelljs")
const install = require("./install")

try {
  install()
  const username = core.getInput("username").trim()
  const password = core.getInput("password").trim()
  const config = core.getInput("config").trim()

  core.warning("Donwloading config file")
  https
    .get(config, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream("__config.ovpn")
        res.pipe(file)
        file.on("finish", () => {
          file.close()

          fs.writeFileSync("__up.txt", [username, password].join("\n"))
          fs.writeFileSync("openvpn.log", "")

          const tail = new Tail("openvpn.log")

          try {
            shell.exec(
              `sudo openvpn --config __config.ovpn --daemon --log openvpn.log --auth-user-pass __up.txt`
            )
          } catch (error) {
            core.error(fs.readFileSync("openvpn.log", "utf8"))
            tail.unwatch()
            throw error
          }

          tail.on("line", (data) => {
            core.info(data)
            if (data.includes("Initialization Sequence Completed")) {
              core.info("VPN connected successfully.")
              tail.unwatch()
              clearTimeout(timer)
            }
          })

          const timer = setTimeout(() => {
            core.setFailed("VPN connection failed.")
            tail.unwatch()
          }, 15000)
        })
      } else {
        throw new Error("Download error!")
      }
    })
    .on("error", (error) => {
      throw error
    })
} catch (error) {
  core.setFailed(error.message)
}
