import { RequestHandler } from "express";
import { MaglevSensorData, MaglevSystemState } from "@shared/api";

let systemState: MaglevSystemState = {
  status: 'STABLE',
  stabilityScore: 98.5,
  aiOptimizationEnabled: true,
  predictedForce: 1250,
  actualForce: 1248,
};

const generateMockData = (): MaglevSensorData => ({
  timestamp: Date.now(),
  acceleration: {
    x: (Math.random() - 0.5) * 0.1,
    y: (Math.random() - 0.5) * 0.1,
    z: 9.8 + (Math.random() - 0.5) * 0.2,
  },
  magneticField: 1.2 + Math.random() * 0.1,
  temperature: 42 + Math.random() * 2,
  energyConsumption: 500 + Math.random() * 50,
  liftForce: systemState.actualForce + (Math.random() - 0.5) * 10,
  gapDistance: 15 + (Math.random() - 0.5) * 0.5,
});

export const handleGetMaglevData: RequestHandler = (req, res) => {
  res.json(generateMockData());
};

export const handleGetMaglevState: RequestHandler = (req, res) => {
  res.json(systemState);
};

export const handlePostMaglevControl: RequestHandler = (req, res) => {
  const { type, targetForce } = req.body;
  
  if (type === 'ADJUST_FORCE') {
    systemState.predictedForce = targetForce;
    // Simulate AI optimization lag
    setTimeout(() => {
      systemState.actualForce = targetForce + (Math.random() - 0.5) * 5;
      systemState.stabilityScore = 95 + Math.random() * 5;
    }, 100);
  } else if (type === 'EMERGENCY_STOP') {
    systemState.status = 'STANDBY';
    systemState.actualForce = 0;
    systemState.stabilityScore = 0;
  }
  
  res.json({ success: true, state: systemState });
};

// SSE stream for real-time data
export const handleMaglevStream: RequestHandler = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const interval = setInterval(() => {
    const data = generateMockData();
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 100); // 10Hz update rate

  req.on('close', () => {
    clearInterval(interval);
  });
};
