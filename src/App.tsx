import { useEffect, useState } from 'react';
import { fetchGyms } from './api/gyms';
import { GymDetail } from './components/GymDetail';
import { GymList } from './components/GymList';
import { GymMap } from './components/GymMap';
import { SummaryStrip } from './components/SummaryStrip';
import type { Gym } from './types';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; gyms: Gym[] };

export default function App() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchGyms(controller.signal)
      .then((gyms) => {
        setLoadState({ status: 'ready', gyms });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        const message =
          error instanceof Error ? error.message : 'Unexpected error loading gyms';
        setLoadState({ status: 'error', message });
      });

    return () => controller.abort();
  }, []);

  const gyms = loadState.status === 'ready' ? loadState.gyms : [];
  const selectedGym = gyms.find((gym) => gym.id === selectedGymId) ?? null;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Gym performance dashboard</h1>
          <p>
            Starter view of gym locations, bookings, and revenue. Filtering and high-performer
            highlighting are left for you.
          </p>
        </div>
      </header>

      {loadState.status === 'loading' && (
        <p className="status-banner" role="status">
          Loading gyms…
        </p>
      )}

      {loadState.status === 'error' && (
        <p className="status-banner error" role="alert">
          {loadState.message}
        </p>
      )}

      {loadState.status === 'ready' && (
        <>
          <SummaryStrip gyms={gyms} />
          <div className="workspace">
            <GymList
              gyms={gyms}
              selectedGymId={selectedGymId}
              onSelect={setSelectedGymId}
            />
            <GymMap
              gyms={gyms}
              selectedGymId={selectedGymId}
              onSelect={setSelectedGymId}
            />
            <GymDetail gym={selectedGym} />
          </div>
        </>
      )}
    </div>
  );
}
