const shell = require("shelljs")
const core = require("@actions/core")

const cmd = "sudo killall openvpn"
const res = shell.exec(cmd)
if (res !== 0) {
  core.warning(res.stdout)
  core.warning(`command: ${cmd} returned ${res.code}`)
}
core.info(res.stdout)
