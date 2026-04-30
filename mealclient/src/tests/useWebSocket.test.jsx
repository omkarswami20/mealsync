import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useWebSocket from '../hooks/useWebSocket';

describe('useWebSocket', () => {
  let mockWebSocket;
  const mockUrl = 'ws://localhost:3001/ws';

  beforeEach(() => {
    vi.stubEnv('VITE_WS_URL', mockUrl);
    
    mockWebSocket = {
      close: vi.fn(),
      send: vi.fn(),
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
    };

    // Mock global WebSocket
    global.WebSocket = vi.fn().mockImplementation(function() {
      return mockWebSocket;
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('connects to the correct WS URL', () => {
    const orderId = '123';
    renderHook(() => useWebSocket({ orderId, onMessage: vi.fn() }));

    expect(global.WebSocket).toHaveBeenCalledWith(`${mockUrl}?orderId=${orderId}`);
  });

  it('calls onMessage when a message is received', () => {
    const onMessage = vi.fn();
    renderHook(() => useWebSocket({ orderId: '123', onMessage }));

    const messageData = { status: 'PREPARING' };
    const event = { data: JSON.stringify(messageData) };
    
    // Simulate message
    mockWebSocket.onmessage(event);

    expect(onMessage).toHaveBeenCalledWith(messageData);
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket({ orderId: '123', onMessage: vi.fn() }));

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalledWith(1000, 'Component unmounted');
  });
});
