# Maglev Control System Guide

This guide explains how to use and test the real-time Maglev Control System integrated into the EcoTrack dashboard.

## Overview
The Maglev System consists of:
1.  **Real-time Telemetry Service**: An SSE-based stream providing sensor data at 10Hz.
2.  **AI Optimization Engine**: A simulated neural network that adjusts force outputs to maintain levitation stability.
3.  **Command Center Dashboard**: A futuristic React-based UI for monitoring and control.
4.  **Digital Twin Simulation**: A physics engine that compares predicted performance against real-world sensor data.

## Getting Started
1.  **Access the Dashboard**: Navigate to `/maglev-dashboard` in the application sidebar.
2.  **Monitor Live Data**: Observe the "Stability", "Power Efficiency", and "Stability Vector" charts. These are fueled by the SSE stream from `server/routes/maglev.ts`.
3.  **Enable AI Optimization**: Toggle the AI switch to allow the system to automatically adjust the target lift force based on simulated drift.
4.  **Manual Control**: Use the "Target Lift Force" slider to manually override the actuators and observe the system response in the 3D visualization.

## Technical Details
-   **Backend**: Express + SSE (Server-Sent Events) for low-latency updates.
-   **Frontend**: React + Recharts + Framer Motion for high-performance visualization.
-   **Simulation**: `server/simulation.ts` handles the physics modeling of the maglev puck.
-   **Testing**: `server/maglev.test.ts` provides validation for data structures and stability logic.

## Deployment & Scaling
The system is designed for microservices architecture:
-   **Ingestion**: Can be scaled using MQTT brokers (e.g., VerneMQ).
-   **Processing**: Stream processing can be moved to Apache Flink for true horizontal scaling.
-   **Analytics**: Historical data is ready to be persisted to InfluxDB or TimescaleDB.

## Running Tests
To run the Maglev logic tests:
```bash
npm run test
```
