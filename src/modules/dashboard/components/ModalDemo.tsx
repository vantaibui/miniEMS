import { useState } from 'react';
import { UiButton, UiFormField, UiInput, UiModal, UiText } from '@libs/ui';

/**
 * Demo for Modal component.
 * Best practice:
 * - Use modals for focused tasks (creating/editing)
 * - Provide clear actions (primary/ghost)
 * - Use loading state on primary action during async work
 */
export const ModalDemo = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <UiText variant="heading" gutterBottom>
          Modals
        </UiText>
        <UiText variant="caption" tone="secondary">
          Dialogs for focused interactions and task-specific flows.
        </UiText>
      </div>

      <div className="flex flex-wrap gap-4">
        <UiButton onClick={() => setBasicOpen(true)}>Open Basic Modal</UiButton>
        <UiButton variant="secondary" onClick={() => setFormOpen(true)}>
          Open Form Modal
        </UiButton>
      </div>

      {/* Basic Modal */}
      <UiModal
        open={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="Basic Information"
        actions={
          <UiButton onClick={() => setBasicOpen(false)}>Understood</UiButton>
        }
      >
        <UiText variant="body">
          This is a simple modal window with a title and a single action. Use
          this for information that requires user acknowledgement.
        </UiText>
      </UiModal>

      {/* Form Modal */}
      <UiModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Create New Role"
        size="sm"
        disableBackdropClose
        actions={
          <>
            <UiButton
              variant="ghost"
              onClick={() => setFormOpen(false)}
              disabled={loading}
            >
              Cancel
            </UiButton>
            <UiButton loading={loading} onClick={handleFormSubmit}>
              Create Role
            </UiButton>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <UiText variant="body">
            Configure the basic settings for the new TMA Insights role.
          </UiText>
          <UiFormField label="Role Name" required>
            <UiInput placeholder="e.g. Content Auditor" disabled={loading} />
          </UiFormField>
          <UiFormField label="Description">
            <UiInput placeholder="What does this role do?" disabled={loading} />
          </UiFormField>
        </div>
      </UiModal>
    </div>
  );
};
