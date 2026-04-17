/**
 * Maglev System Real-time Simulation Engine (Mock)
 * This script simulates the physics of the maglev puck and compares it with AI predictions.
 */

interface PhysicsState {
  position: number; // Vertical position in mm
  velocity: number; // velocity in mm/s
  force: number;    // lift force in Newtons
}

const TARGET_GAP = 15.0; // mm
const MASS = 10.0;       // kg
const GRAVITY = 9.81;    // m/s^2

let currentState: PhysicsState = {
  position: 15.0,
  velocity: 0,
  force: MASS * GRAVITY,
};

function stepSimulation(dt: number, appliedForce: number) {
  // F = ma => a = F/m
  // Net force = Applied Force - (Mass * Gravity)
  const netForce = appliedForce - (MASS * GRAVITY);
  const acceleration = (netForce / MASS) * 1000; // convert to mm/s^2

  currentState.velocity += acceleration * dt;
  currentState.position += currentState.velocity * dt;

  // Simple damping to simulate air resistance/friction
  currentState.velocity *= 0.99;

  return { ...currentState };
}

export function runComparisonUpdate(appliedForce: number, aiPredictedForce: number) {
  const actualState = stepSimulation(0.1, appliedForce);
  const deviation = Math.abs(actualState.force - aiPredictedForce);
  
  return {
    actualPosition: actualState.position,
    predictedForce: aiPredictedForce,
    actualForce: appliedForce,
    deviation,
    stabilityWarning: deviation > 50,
  };
}
