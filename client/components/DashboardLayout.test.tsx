import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

describe('DashboardLayout Component UI Test', () => {
  it('renders without crashing and displays the branding', () => {
    render(
      <BrowserRouter>
        <DashboardLayout title="Test Dashboard">
          <div>Test Content Node</div>
        </DashboardLayout>
      </BrowserRouter>
    );
    
    // Check if the sidebar brand title is present
    expect(screen.getByText('EcoTrack')).toBeDefined();
    
    // Check if the dynamic page title is present
    expect(screen.getByText('Test Dashboard')).toBeDefined();
    
    // Check if children content rendered
    expect(screen.getByText('Test Content Node')).toBeDefined();
    
    // Check if footer text is present
    expect(screen.getByText(/All Rights Reserved – EcoTrack/i)).toBeDefined();
  });
});
