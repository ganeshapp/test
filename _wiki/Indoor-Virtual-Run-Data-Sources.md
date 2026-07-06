---
permalink: /wiki/Indoor-Virtual-Run-Data-Sources/
title: "Indoor Virtual Run Data Sources"
date: 2026-05-22
tags: [cycling, running, gpx]
---

To run or ride a virtual version of a real-world route on a treadmill or smart trainer, the app needs a sequence of GPS coordinates with elevation. The data exists for free; the industry standards are **GPX** (GPS Exchange Format) and **TCX** (Training Center XML), both plain XML text files.

## Where to get route data

- **Strava Route Builder.** Map any route worldwide and export as GPX or TCX. Works for both running and cycling.
- **Ride with GPS.** Arguably the best cycling-route catalogue. Millions of user-uploaded real-world rides, exportable as GPX.
- **Komoot.** Strong on hiking and gravel routes, with curated trail recommendations and GPX export.
- **MapMyFitness.** Older platform; many popular running routes still archived there. Note: many MapMyFitness GPX exports contain only coordinates and not elevation, even when the website shows an elevation graph.

## Filling in missing elevation

If a GPX file has coordinates but no elevation (a common gap), elevation can be queried from a public elevation API and stitched back in:

- **Open Elevation** — free, open-source, decent coverage
- **OpenTopoData** — runs SRTM and other public datasets
- **Google Elevation API** — paid for serious volume, free quota for hobby use

The workflow: parse the GPX, iterate over the trackpoints, query the elevation API in batches, and write a new GPX with elevation populated. Smoothing the elevation curve with a moving average (5–10 points) tends to give a more realistic treadmill experience — raw SRTM data is noisy and produces a sawtooth incline pattern that no real road has.

## Translating a route to the equipment

### Treadmill (running)

Direct 1:1 translation. Calculate the gradient of the next short segment (e.g. next 50 m) as rise over run, then command the treadmill to that incline. Most apps round to the machine's incline step granularity.

### Smart bike (cycling)

Cycling apps simulate physics. Wheel speed at the trainer does not equal virtual speed on the route. Instead:

1. Read the rider's wattage from the bike's `0x2AD2` characteristic.
2. Read the current gradient from the GPX file.
3. Calculate virtual speed by balancing forces:

```
Power = F_gravity + F_rolling + F_drag
```

The standard simplified cycling physics:

- `F_gravity = m × g × sin(atan(grade))`
- `F_rolling = m × g × Crr × cos(atan(grade))` (Crr ~ 0.004 on smooth asphalt)
- `F_drag = 0.5 × Cd × A × ρ × v²` (Cd × A ~ 0.36 for a road-bike rider, ρ ≈ 1.225 kg/m³)

Solve for `v` given `Power`. As gradient steepens, virtual `v` drops sharply for the same wattage.

In addition, command the bike's physical resistance (opcode `0x04`) so that the pedals feel heavier on virtual hills. The relationship between commanded resistance and felt difficulty varies by bike — needs empirical tuning per machine.

## Uploading the virtual session to Strava

Strava's API supports virtual activities via the `/uploads` endpoint. Steps:

1. Each second during the workout, log GPS point from the GPX track + the rider's HR / cadence / power / speed.
2. At end of session, write a TCX or FIT file. TCX is easier to generate (plain XML). FIT is binary and smaller, but needs a library.
3. POST the file to `/uploads` with `trainer=1` and `sport_type=VirtualRide` or `VirtualRun`.

Strava processes the file, generates the map and elevation profile, and matches segments — exactly as it would for a Zwift or MyWhoosh upload.

## See also

- [Smart Trainer and Smart Bike Setup](/wiki/Smart-Trainer-and-Smart-Bike-Setup/)
- [Reverse Engineering Fitness Devices](/wiki/Reverse-Engineering-Fitness-Devices/)
- [Treadmill Workout Types](/wiki/Treadmill-Workout-Types/)
