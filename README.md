# Acuparse RTL Relay Server

Provides a lightweight Syslog server for relaying [rtl_433](https://github.com/merbanan/rtl_433) data packets to Acuparse for further processing.

The relay server listens on port `10514` for syslog messages.

See the [Acuparse RTL Docs](https://docs.acuparse.com/REALTIME/) for more information and configuration details.

## Standalone Container

```bash
docker run -d --rm --name rtl-relay \
    -e PRIMARY_MAC_ADDRESS=000000000000 \
    -e ACUPARSE_HOSTNAME=acuparse.example.com \
    -p 10514:10514 \
    acuparse/rtl-relay
```

## Docker Compose

```yaml
version: '3.7'

services:
  relay:
    image: acuparse/rtl-relay
    environment:
      - PRIMARY_MAC_ADDRESS=000000000000
      - ACUPARSE_HOSTNAME=acuparse.example.com
    restart: always

  rtl:
    image: hertzg/rtl_433
    restart: always
    command: -F syslog:relay:10514
    devices:
      - "/dev/bus/usb/001:/dev/bus/usb/001"
    depends_on:
      - relay
```
