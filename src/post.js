const exec = require("./exec")
const core = require("@actions/core")

module.exports = () => {
  try {
    exec("sudo killall openvpn")
  } catch (error) {
    core.warning(error.message)
  }
}
