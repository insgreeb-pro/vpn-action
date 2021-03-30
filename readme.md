# VPN Action

Connect to OpenVPN using github actions

# Usage

```yml
- uses: insgreeb-pro/vpn-action@v1
  name: Connect to OpenVPN
  with:
    username: ${{ secrets.VPN_USER }}
    password: ${{ secrets.VPN_PASSWORD }}
    config: ${{ secrets.VPN_FILE }}
```

**username** - (_required_) username to connect vpn server\
**password** - (_required_) password to connect vpn server\
**config** - (_required_) url to download conifig file `.ovpn`

---

## Example

**with ping test**:

```yml
- uses: insgreeb-pro/vpn-action@v1
  name: Connect to OpenVPN
  with:
    username: ${{ secrets.VPN_USER }}
    password: ${{ secrets.VPN_PASSWORD }}
    config: ${{ secrets.VPN_FILE }}

- name: PING Test
  run: ping -c 4 ${{ secrets.LOCAL_SERVER }}
```
