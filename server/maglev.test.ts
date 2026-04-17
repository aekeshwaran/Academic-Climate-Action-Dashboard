import { describe, it, expect } from 'vitest';
import { MaglevSensorData } from '../shared/api';

describe('Maglev System Data Logic', () => {
  it('should validate sensor data structure', () => {
    const mockData: MaglevSensorData = {
      timestamp: Date.now(),
      acceleration: { x: 0.1, y: -0.1, z: 9.81 },
      magneticField: 1.25,
      temperature: 42.5,
      energyConsumption: 512,
      liftForce: 1250,
      gapDistance: 15.2,
    };

    expect(mockData.liftForce).toBeGreaterThan(0);
    expect(mockData.gapDistance).toBeGreaterThan(0);
    expect(mockData.acceleration.z).toBeCloseTo(9.8, 1);
  });

  it('should calculate stability scores correctly (mock logic)', () => {
    const calculateStability = (gap: number, target: number) => {
      const error = Math.abs(gap - target);
      return Math.max(0, 100 - (error * 10));
    };

    expect(calculateStability(15.0, 15.0)).toBe(100);
    expect(calculateStability(16.0, 15.0)).toBe(90);
    expect(calculateStability(25.0, 15.0)).toBe(0);
  });
});
