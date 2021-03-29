const exec = require("./exec")

module.exports = () => {
  // installing dependencies
  exec("sudo apt install openvpn")
}
