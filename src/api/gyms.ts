import type { Gym, GymListResponse } from '../types';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchGyms(signal?: AbortSignal): Promise<Gym[]> {
  const response = await fetch('/api/gyms', { signal });

  if (!response.ok) {
    let message = `Failed to load gyms (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // keep default message
    }
    throw new ApiError(message, response.status);
  }

  const body = (await response.json()) as GymListResponse;
  return body.data;
}
