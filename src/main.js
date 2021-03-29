const exec = require("./exec")
const fs = require("fs")
const Tail = require("tail")

module.exports = () => {
  // installing dependencies
  const config = core.getInput("config").trim()
  const username = core.getInput("username").trim()
  const password = core.getInput("password").trim()

  const cfg = "__config.ovpn"
  const auth = "__up.txt"
  const log = "openvpn.log"

  exec("sudo apt install openvpn openvpn-systemd-resolved")
  exec(`curl ${config}>${cfg}`)

  fs.writeFileSync(auth, [username, password].join("\n"))
  fs.writeFileSync(log, "")

  const tail = new Tail(log)

  try {
    exec(
      `sudo openvpn --config ${cfg} --daemon --auth-user-pass ${auth} --log ${log}`
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
}
