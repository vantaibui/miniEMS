import { UiCard, UiText } from '@libs/ui';

/**
 * Demo for Card component.
 * Best practice:
 * - Use cards to group related information.
 * - Use 'outlined' variant for subtle grouping on standard backgrounds.
 */
export const CardDemo = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <UiText variant="heading" gutterBottom>
          Cards
        </UiText>
        <UiText variant="caption" tone="secondary">
          Flexible containers for grouping related content.
        </UiText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiCard padding="md">
          <UiText variant="subheading" gutterBottom>
            Default Card
          </UiText>
          <UiText variant="body">
            This is a default card with medium padding. It uses the project's
            standard shadow and border tokens.
          </UiText>
        </UiCard>

        <UiCard variant="outlined" padding="md">
          <UiText variant="subheading" gutterBottom>
            Outlined Card
          </UiText>
          <UiText variant="body">
            Outlined cards use a 1px border without a shadow. Ideal for
            secondary information or nested content.
          </UiText>
        </UiCard>

        <UiCard padding="sm" className="bg-gray-50">
          <UiText variant="subheading" gutterBottom>
            Small Padding
          </UiText>
          <UiText variant="body">
            Compact card layout for denser information displays.
          </UiText>
        </UiCard>

        <UiCard padding="lg">
          <UiText variant="subheading" gutterBottom>
            Large Padding
          </UiText>
          <UiText variant="body">
            Spacious card layout, great for main content or dashboard
            highlights.
          </UiText>
        </UiCard>
      </div>
    </div>
  );
};
