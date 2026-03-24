import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, beforeAll } from 'vitest';
import { Contact } from '@/features/contact/components/Contact';

// Mock framer-motion's useInView dependency
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

describe('Contact Component', () => {
  test('renders contact form fields', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('Your name')).toBeDefined();
    expect(screen.getByPlaceholderText('your@email.com')).toBeDefined();
    expect(screen.getByPlaceholderText('Describe the mission...')).toBeDefined();
  });

  test('validates required fields on submit', async () => {
    render(<Contact />);
    fireEvent.click(screen.getByText('Execute Send'));
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters.')).toBeDefined();
      expect(screen.getByText('Please enter a valid email address.')).toBeDefined();
      expect(screen.getByText('Message must be at least 10 characters.')).toBeDefined();
    });
  });
});
