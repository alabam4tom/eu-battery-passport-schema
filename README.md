# EU Battery Passport Schema (Regulation (EU) 2023/1542 — Annex XIII)

Open-source TypeScript types, access-level metadata (`public`, `legitimate_interest`, `authorities`), JSON Schema, and GS1 Digital Link helper for the **EU Battery Digital Product Passport**, mandatory starting **18 February 2027**.

Maintained by [DPPify](https://www.dppify.com) — the no-code Digital Product Passport platform for European SMEs.

## Useful Resources
- **Live Battery Passport Demo**: [www.dppify.com/demo](https://www.dppify.com/demo)
- **Free GS1 Digital Link QR Code Generator**: [www.dppify.com/gs1-qr-generator](https://www.dppify.com/gs1-qr-generator)
- **EU Battery Passport Guide (18 Feb 2027)**: [www.dppify.com/dpp-batteries](https://www.dppify.com/dpp-batteries)
- **Do I need a DPP? (Interactive Checker)**: [www.dppify.com/verificateur-dpp](https://www.dppify.com/verificateur-dpp)

---

## Scope (Regulation (EU) 2023/1542, Article 77 & Annex XIII)

From **18 February 2027**, a Digital Product Passport is mandatory for:
- Electric Vehicle (**EV**) batteries
- Light Means of Transport (**LMT**) batteries (e-bikes, e-scooters, e-mopeds)
- Industrial batteries with a capacity **above 2 kWh**

## Access Levels (Annex XIII)

| Access Level | Who can read | Examples |
|---|---|---|
| `public` | Consumers & anyone scanning the QR code | Battery category, chemistry, rated capacity/energy, carbon footprint, recycled content, hazardous substances |
| `legitimate_interest` | Repairers, second-life operators, recyclers | Disassembly instructions, detailed cell composition, State of Health (SoH), cycle count |
| `authorities` | Market surveillance & notified bodies | Compliance declarations and restricted audit records |

## Quick Usage

```ts
import {
  BATTERY_FIELD_ACCESS,
  buildGs1DigitalLinkUri,
  pickBatteryFieldsByAccess,
  validateBatteryPassport,
} from "./src/index.js";

const uri = buildGs1DigitalLinkUri({
  gtin: "03760123456789",
  batchNumber: "LOT-2026-LY4",
  serialNumber: "VC-720-004819",
});
// -> https://id.gs1.org/01/03760123456789/10/LOT-2026-LY4/21/VC-720-004819

const validation = validateBatteryPassport({
  batteryCategory: "lmt",
  chemistry: "NMC 811",
  ratedCapacityAh: 20,
  ratedEnergyKwh: 0.72,
  nominalVoltageV: 36,
  carbonFootprintKgCo2ePerKwh: 54.2,
});
```

## Files
- `schema/battery-passport.schema.json` — JSON Schema (Draft 2020-12)
- `src/index.ts` — TypeScript types, Annex XIII access-level map, validator & GS1 Digital Link builder
- `examples/lmt-battery-passport.json` — Complete LMT e-bike battery passport example

## License
MIT © [DPPify](https://www.dppify.com)
