---
permalink: /wiki/Smart-Trainer-and-Smart-Bike-Setup/
title: "Smart Trainer and Smart Bike Setup"
date: 2026-05-22
tags: [cycling, bluetooth, ftms]
---

Most modern smart treadmills, smart bikes, and smart trainers speak a common Bluetooth language: the **Fitness Machine Service (FTMS)** protocol. Once you know what to look for, almost every consumer device is hackable in the friendly sense — readable, controllable, and recordable by any app you write yourself.

This page is a quick reference for the relevant Bluetooth services and characteristics, and how to verify them with the free nRF Connect app before writing a line of code. See [Reverse Engineering Fitness Devices](/wiki/Reverse-Engineering-Fitness-Devices/) for the broader workflow.

## The relevant Bluetooth services

| Service | UUID | What it's for |
| --- | --- | --- |
| Fitness Machine Service (FTMS) | `0x1826` | The umbrella service — treadmills, indoor bikes, ellipticals, rowers all expose this |
| Cycling Power Service (CPS) | `0x1818` | Watts-focused. Some bikes use this in addition to FTMS |
| Cycling Speed and Cadence (CSCS) | `0x1816` | Wheel speed and pedal RPM |
| Heart Rate Service | `0x180D` | Used by chest straps, watches, optical monitors |

## Important FTMS characteristics

| Equipment | Data characteristic | What it pushes every second |
| --- | --- | --- |
| Treadmill | `0x2ACD` | Speed, distance, incline, time |
| Indoor bike | `0x2AD2` | Speed, cadence, power, resistance |
| Cross-trainer / elliptical | `0x2ACE` | Mixed |
| Control point | `0x2AD9` | Where you send commands |
| Supported speed range | `0x2AD4` | Min/max/step for speed |
| Supported inclination range | `0x2AD5` | Min/max/step for incline |
| Supported resistance range | `0x2AD6` | Min/max/step for resistance |

The data characteristic packets are binary. The first two bytes are flags telling the parser which fields are included; the rest is a stream of little-endian integers with specific resolutions:

- **Speed:** 2 bytes, 0.01 km/h units
- **Distance:** 3 bytes, metres
- **Incline:** 2 bytes signed, 0.1% units
- **Cadence:** 2 bytes, 0.5 RPM units
- **Power:** 2 bytes signed, 1 W units
- **Resistance:** 2 bytes signed, unitless

## The control handshake

Before commanding a machine, the app must request control:

1. Write `0x00` (Request Control) to `0x2AD9`.
2. Wait for an indication. `[0x80, 0x00, 0x01]` means success.
3. Write `0x07` (Start/Resume) to begin the session.
4. Send target commands as needed.
5. Write `0x08` (Stop/Pause) when finished.

### Common opcodes

| Opcode | Meaning | Payload |
| --- | --- | --- |
| `0x00` | Request control | (none) |
| `0x02` | Set target speed | speed × 100, little-endian |
| `0x03` | Set target incline | incline × 10, little-endian, signed |
| `0x04` | Set target resistance | resistance × 10, little-endian |
| `0x05` | Set target power (ERG mode) | watts, little-endian |
| `0x07` | Start / resume | (none) |
| `0x08` | Stop / pause | (none) |

### Worked examples

- Set speed to 10 km/h: `02 E8 03` (1000 = `0x03E8`, flipped)
- Set speed to 16 km/h: `02 40 06` (1600 = `0x0640`, flipped)
- Set incline to 3.0%: `03 1E 00` (30 = `0x001E`, flipped)
- Set power to 200 W: `05 C8 00`
- Set resistance to level 10: `04 64 00`

## Manufacturer quirks

The FTMS standard says incline commands should be in **true percentage grade**. In practice many consumer treadmills shortcut this and map the percentage value directly to their console levels. For example, a treadmill with 18 mechanical incline steps may treat "incline = 3.0%" as "go to step 3," which is neither 3% nor 3 degrees.

The way to handle this is:

- Read the supported inclination range from `0x2AD5` to learn how the machine indexes incline.
- Empirically measure the physical angle at a few representative steps with a phone-based protractor app.
- Build a custom mapping in the app from "true grade" to "machine step."

Bikes that support ERG mode (target wattage) are usually well-behaved. Resistance-mode bikes vary more.

## Testing without writing code

The free **nRF Connect** app (iOS / Android) is a generic BLE explorer. It is the right first step before writing anything:

1. Open nRF Connect, scan for devices, connect to the trainer.
2. Find service `0x1826`. If it's not there, the machine doesn't speak standard FTMS — check the manufacturer's docs.
3. Subscribe to notifications on the relevant data characteristic (`0x2ACD` for treadmills, `0x2AD2` for bikes).
4. Enable indications on `0x2AD9` and write `0x00`. If the response is `80 00 01`, the control point is open and not locked by the manufacturer.

If the manufacturer locked the control point, the app can still **read** data — write workouts on the machine console and record from a custom app. Only the auto-driving-the-machine workflow is blocked.

## See also

- [Reverse Engineering Fitness Devices](/wiki/Reverse-Engineering-Fitness-Devices/)
- [Cycling Power Benchmarks](/wiki/Cycling-Power-Benchmarks/)
- [Power Meter Options](/wiki/Power-Meter-Options/)
- [Indoor Virtual Run Data Sources](/wiki/Indoor-Virtual-Run-Data-Sources/)
