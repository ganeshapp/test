---
permalink: /wiki/Reverse-Engineering-Fitness-Devices/
title: "Reverse Engineering Fitness Devices"
date: 2026-05-22
tags: [cycling, treadmill, bluetooth, ftms]
---

Most consumer treadmills, smart bikes, and smart trainers expose a generic Bluetooth interface and can be read and controlled by any app that understands the [FTMS protocol](Smart%20Trainer%20and%20Smart%20Bike%20Setup.md). The challenge is rarely the protocol — it's confirming that the specific machine in front of you obeys the standard, and discovering the quirks the manufacturer baked in.

This page describes the workflow for verifying and characterising a device before writing app code, and a few of the gotchas that come up in practice.

## Workflow

### Step 1: Open nRF Connect and scan

Install **nRF Connect** (free, by Nordic Semiconductor) on a phone. Wake the device, scan, and connect.

### Step 2: Look for FTMS

Find service `0x1826`. If it's present, the machine speaks the standard.

### Step 3: Subscribe to the data characteristic

- Treadmills: `0x2ACD`
- Indoor bikes: `0x2AD2`
- Cross-trainers: `0x2ACE`

Tap the down-arrows icon to enable notifications. Walk on the treadmill or pedal the bike; numbers should update once a second. If the characteristic supports `READ` as well, read once and note the raw bytes — that confirms encoding.

### Step 4: Verify the control point

Find characteristic `0x2AD9`. Check its properties.

- If `WRITE` is present, the app can send commands.
- If `INDICATE` is present, the app can receive confirmations.

Enable indications, open the write dialog, send `00` (Request Control), and watch for a response. `80 00 01` means the control point is open. Anything else means the manufacturer has locked control to their official app.

### Step 5: Test movement commands

Stand on the side rails (not the belt) for treadmill testing. Send `07` to start, then try short speed and incline commands. Stop with `08`.

### Step 6: Map the manufacturer's quirks

Compare the values commanded over Bluetooth with what the machine actually does. Build a calibration table.

## Common quirks

### Treadmill incline mapped to step numbers, not real grade

The FTMS standard says incline is in true percentage. Many manufacturers shortcut by mapping the percentage value to console step numbers. A treadmill with 18 incline steps might treat "incline = 3.0%" as "step 3," which is neither 3% nor 3 degrees of physical tilt.

The fix: build a calibration map.

| Console level | FTMS command | Real grade (measured with phone protractor) |
| --- | --- | --- |
| 0 | `03 00 00` | 0.0% |
| 5 | `03 32 00` | varies by machine |
| 10 | `03 64 00` | varies by machine |
| 15 | `03 96 00` | varies by machine |
| 18 (max) | `03 B4 00` | varies by machine |

Measure the actual angle at a few steps with a protractor app, fit a line or curve, and let the app translate between "true grade" the user requested and "level value" the machine expects.

### Treadmill cadence does not exist on the treadmill

A treadmill knows belt speed. It doesn't know how often the runner's feet are striking the belt. Cadence on Zwift or MyWhoosh comes from a separate sensor — a foot pod (Stryd, Zwift Runn) or a watch broadcasting cadence (e.g. Garmin's Virtual Run profile).

If accurate cadence matters, a wrist-based runner's watch in Virtual Run mode can broadcast heart rate, cadence, and pace simultaneously over Bluetooth. The app pairs separately to the watch using the standard heart rate (`0x180D`) and running speed/cadence (`0x1814`) services.

### Smart bikes that don't truly measure power

Most consumer smart bikes estimate power from flywheel speed and resistance level rather than measuring it with strain gauges. The estimate is often 30–50% off for strong riders and may cap out at high efforts. Always cross-check against a known-good device before trusting power numbers for serious training. See [Power Meter Options](/wiki/Power-Meter-Options/).

### Bike has both SIM mode and ERG mode

- **SIM mode:** the app calculates virtual speed from the rider's wattage and the simulated terrain; the bike's resistance physically increases on virtual hills.
- **ERG mode:** the app commands the bike to hold a specific wattage and the bike auto-adjusts resistance based on cadence.

For virtual outdoor rides (GPX route), the app wants SIM. For structured intervals, ERG. The "trainer difficulty" setting in apps like MyWhoosh controls how aggressively the app commands resistance changes — at 0%, the bike does not change at all and the app only changes the virtual speed for the same wattage.

## Multiple concurrent BLE connections

Phones can typically maintain 4–7 active BLE connections at once, which is enough to wire up:

- The machine (treadmill or bike) via FTMS
- A heart rate strap via `0x180D`
- A watch broadcasting cadence via `0x1814`

The app reads from all three, merges them every second, and writes the combined stream to a TCX or FIT file at the end.

## See also

- [Smart Trainer and Smart Bike Setup](/wiki/Smart-Trainer-and-Smart-Bike-Setup/)
- [Power Meter Options](/wiki/Power-Meter-Options/)
- [Indoor Virtual Run Data Sources](/wiki/Indoor-Virtual-Run-Data-Sources/)
