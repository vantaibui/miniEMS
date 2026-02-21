import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@modules/auth';
import AppShell from './AppShell';

export function mount(container: HTMLElement) {
  const root = createRoot(container);
  root.render(
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
  return () => root.unmount();
}
