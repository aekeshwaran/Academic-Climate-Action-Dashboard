/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface MaglevSensorData {
  timestamp: number;
  acceleration: { x: number; y: number; z: number };
  magneticField: number;
  temperature: number;
  energyConsumption: number;
  liftForce: number;
  gapDistance: number;
}

export interface MaglevControlCommand {
  type: 'ADJUST_FORCE' | 'EMERGENCY_STOP' | 'RECALIBRATE';
  targetForce: number;
  params?: Record<string, any>;
}

export interface MaglevSystemState {
  status: 'STABLE' | 'UNSTABLE' | 'CRITICAL' | 'STANDBY';
  stabilityScore: number;
  aiOptimizationEnabled: boolean;
  predictedForce: number;
  actualForce: number;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
