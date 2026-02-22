import { useMemo, useState } from 'react';

import { UiButton, UiFormField, UiInput, UiSelect, UiText } from '@libs/ui';

interface FormState {
  fullName: string;
  email: string;
  role: string;
}

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Project Manager' },
  { value: 'viewer', label: 'Viewer' },
];

/**
 * Demo for form composition.
 * Best practices:
 * - Use UiFormField to standardize label/help/error rendering
 * - Keep validation close to form state (or use a form library if needed)
 * - Use UiButton loading for submit
 */
export const FormDemo = () => {
  const [state, setState] = useState<FormState>({
    fullName: '',
    email: '',
    role: '',
  });
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    fullName: false,
    email: false,
    role: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!state.fullName.trim()) next.fullName = 'Full name is required.';
    if (!state.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(state.email))
      next.email = 'Email is invalid.';
    if (!state.role) next.role = 'Please select a role.';

    return next;
  }, [state]);

  const canSubmit = Object.keys(errors).length === 0;

  const handleSubmit = async () => {
    setTouched({ fullName: true, email: true, role: true });
    if (!canSubmit) return;

    setSubmitting(true);
    // Simulate request; do NOT connect business logic here (demo only)
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <UiText variant="heading" gutterBottom>
          Forms
        </UiText>
        <UiText variant="caption" tone="secondary">
          Realistic form composition with simple validation and submit loading.
        </UiText>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <UiText variant="subheading">Create User</UiText>

          <UiFormField
            label="Full name"
            required
            errorText={touched.fullName ? errors.fullName : undefined}
            helperText="Use the name that appears in your HR system."
          >
            <UiInput
              value={state.fullName}
              onChange={(e) =>
                setState((s) => ({ ...s, fullName: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
              placeholder="e.g. Alex Rivers"
            />
          </UiFormField>

          <UiFormField
            label="Email"
            required
            errorText={touched.email ? errors.email : undefined}
          >
            <UiInput
              value={state.email}
              onChange={(e) =>
                setState((s) => ({ ...s, email: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="e.g. alex.rivers@company.com"
              type="email"
              autoComplete="email"
            />
          </UiFormField>

          <UiFormField
            label="Role"
            required
            errorText={touched.role ? errors.role : undefined}
          >
            <UiSelect
              options={roleOptions}
              placeholder="Select a role"
              value={state.role}
              onChange={(value) => {
                setState((s) => ({ ...s, role: String(value) }));
                setTouched((t) => ({ ...t, role: true }));
              }}
            />
          </UiFormField>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <UiButton
              loading={submitting}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Create user
            </UiButton>
            <UiButton
              variant="secondary"
              disabled={submitting}
              onClick={() => {
                setState({ fullName: '', email: '', role: '' });
                setTouched({ fullName: false, email: false, role: false });
              }}
            >
              Reset
            </UiButton>
          </div>

          <UiText variant="caption" tone="muted">
            Common pitfall: don’t render inconsistent error text spacing; always
            use UiFormField.
          </UiText>
        </div>

        <div className="space-y-4">
          <UiText variant="subheading">Edge cases</UiText>

          <UiFormField label="Disabled field" helperText="Read-only state">
            <UiInput disabled defaultValue="System-managed value" />
          </UiFormField>

          <UiFormField
            label="Loading field"
            helperText="Use loading to prevent edits during async work"
          >
            <UiInput loading defaultValue="Fetching..." />
          </UiFormField>

          <UiFormField
            label="Disabled select"
            helperText="Used when options depend on other fields"
          >
            <UiSelect
              disabled
              options={roleOptions}
              placeholder="Select a role"
            />
          </UiFormField>
        </div>
      </div>
    </div>
  );
};
