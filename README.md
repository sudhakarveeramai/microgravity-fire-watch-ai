# FireWatch AI — NASA Microgravity Fire Research Intelligence Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NASA Open Science](https://img.shields.io/badge/Data-NASA%20PSI%20%2F%20Open%20Science-0B3D91?style=flat-square&logo=nasa&logoColor=white)](https://science.nasa.gov/open-science/)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

An AI-powered scientific intelligence and mission safety platform analyzing decades of NASA, JAXA, and ESA microgravity combustion experiments. FireWatch AI accelerates fire safety protocol design, predictive flame propagation modeling, and risk mitigation for long-duration crewed missions across the International Space Station (ISS), the Artemis Lunar Gateway, and Mars transit habitats.

---

## 🌟 Key Features

- **Decades of Space Combustion Telemetry & Datasets**:
  - Ingests and standardizes flight and drop-tower experiment datasets including NASA BASS, ACME, CIR, FLEX, and Saffire space-capsule fire tests.
  - Granular environmental parameters: microgravity ($10^{-6}\text{ g}$ to Lunar $0.166\text{ g}$ and Martian $0.38\text{ g}$), ambient pressure ($50 - 101.3\text{ kPa}$), variable oxygen fractions ($15\% - 30\% \text{ O}_2$), and forced convective velocities.

- **AI Microgravity Combustion Prediction Engine**:
  - Predicts flame spread velocities, soot formation, radiative quenching diameters, and extinguishment limits under low-gravity and hypoxic conditions.
  - Instant scenario simulation seeded directly from real-world spaceflight experiment parameters.

- **Spacecraft Mission Fire Safety Scenarios**:
  - **ISS / Low-Earth Orbit**: Microgravity spherical flame behaviors, buoyancy absence, and ventilation duct flame propagation.
  - **Artemis Lunar Surface & Gateway**: Partial gravity convection, reduced-pressure enriched-oxygen ($34\text{ kPa} / 32\% \text{ O}_2$) flammability envelopes.
  - **Deep-Space Mars Transit**: Prolonged closed-loop atmosphere hazards, delayed suppression dynamics, and toxic off-gassing management.

- **Interactive Microgravity Knowledge Graph**:
  - Multi-dimensional graph network mapping cross-domain interactions between solid/liquid fuels (PMMA, Nomex, Silicone, Methanol), oxidizer concentrations, ambient flow regimes, and suppression agents (Halon alternatives, $\text{CO}_2$, fine water mist).

- **Multi-Experiment Analytical Comparison Suite**:
  - Direct side-by-side telemetry inspection across multiple spaceflight campaigns.
  - Dynamic visual analytics for burn rates, mass loss rates, flame front geometry, and temperature gradient profiles.

- **SIH & Space Agency Research Database Hub**:
  - Unified search, multi-factor filtering, and exportable research reports designed for aerospace engineers, safety officers, and microgravity combustion scientists.

- **Dynamic Solar System & Atmospheric Parallax Simulation**:
  - Immersive celestial visualization running smoothly in the background, anchoring mission scenarios to their orbital destinations.

---

## 🚀 Tech Stack & Architecture

- **Frontend Framework**: React 19, TypeScript, Vite
- **Styling & Theming**: Tailwind CSS v4, Lucide Icons, Glassmorphism design tokens
- **Animations & Visualization**: Motion (Framer Motion), Canvas 2D/3D Parallax Orbits, Recharts
- **Backend / API**: Node.js, Express, `tsx` server runtime
- **AI & Reasoning Engine**: Multi-turn scientific reasoning models with domain prompt conditioning
- **Persistence & Cloud**: Firebase Authentication & Cloud Firestore

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sudhakarveeramai/microgravity-fire-watch-ai.git
   cd microgravity-fire-watch-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment template:
   ```bash
   cp .env.example .env
   ```
   Add your API keys and configuration parameters inside `.env`.

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the port specified in terminal).

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔬 Scientific Data References & Research Acknowledgements

- **NASA Physical Sciences Informatics (PSI)**: Spaceflight combustion data from Space Shuttle (STS), Mir, and ISS experiments.
- **Saffire Project**: Spacecraft Fire Safety experiments conducted on uncrewed Cygnus resupply vehicles.
- **ACME & CIR Programs**: Advanced Combustion via Microgravity Experiments & Combustion Integrated Rack investigations.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
