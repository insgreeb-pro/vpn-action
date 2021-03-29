const shell = require("shelljs")
const core = require("@actions/core")

module.exports = () => {
  const cmd = "sudo apt install -y openvpn openvpn-systemd-resolved"
  const res = shell.exec(cmd)
  if (res !== 0) {
    core.warning(res.stdout)
    core.warning(`command: ${cmd} returned ${res.code}`)
  }
  core.info(res.stdout)
}
