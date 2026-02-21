import { UiBadge, UiButton, UiText } from '@libs/ui';

/**
 * Demo for Button component.
 * Best practice:
 * - Use variant to express intent (primary, secondary, ghost, danger)
 * - Use loading for async actions (prevents double-submit)
 */
export const ButtonDemo = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <UiText variant="heading" gutterBottom>
          Buttons
        </UiText>
        <UiText variant="caption" tone="secondary">
          Demonstrates variants, sizes, and states.
        </UiText>
      </div>

      <div className="space-y-3">
        <UiText variant="subheading">Variants</UiText>
        <div className="flex flex-wrap gap-3">
          <UiButton variant="primary">Primary</UiButton>
          <UiButton variant="secondary">Secondary</UiButton>
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="danger">Danger</UiButton>
        </div>
      </div>

      <div className="space-y-3">
        <UiText variant="subheading">Sizes</UiText>
        <div className="flex flex-wrap items-center gap-3">
          <UiButton size="sm">Small</UiButton>
          <UiButton size="md">Medium</UiButton>
          <UiButton size="lg">Large</UiButton>
        </div>
      </div>

      <div className="space-y-3">
        <UiText variant="subheading">States</UiText>
        <div className="flex flex-wrap items-center gap-3">
          <UiButton disabled>Disabled</UiButton>
          <UiButton loading>Loading</UiButton>
          <UiButton variant="secondary" loading>
            Loading (Secondary)
          </UiButton>
          <UiButton variant="danger" loading>
            Loading (Danger)
          </UiButton>
        </div>
      </div>

      <div className="space-y-3">
        <UiText variant="subheading">Realistic CTA Group</UiText>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-divider p-4">
          <div className="flex items-center gap-2">
            <UiBadge variant="info" size="sm">
              Draft
            </UiBadge>
            <UiText variant="body" className="font-medium">
              RBAC User Management
            </UiText>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <UiButton variant="secondary">Export</UiButton>
            <UiButton variant="primary">Add New User</UiButton>
          </div>
        </div>
      </div>
    </div>
  );
};
