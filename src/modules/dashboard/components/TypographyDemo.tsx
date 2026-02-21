import { UiText } from '@libs/ui';

/**
 * Demo for Typography component.
 * Best practice: Use semantic variants (heading, subheading, body, caption) instead of raw HTML tags.
 */
export const TypographyDemo = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <UiText variant="heading" gutterBottom>Typography - Semantic Variants</UiText>
        <UiText variant="caption" tone="secondary">
          Demonstrating all standard typography variants used across the application.
        </UiText>
      </div>

      <div className="flex flex-col gap-4 p-6 border border-divider rounded-lg">
        <div className="space-y-1">
          <UiText variant="caption" tone="muted">variant="heading"</UiText>
          <UiText variant="heading">The quick brown fox jumps over the lazy dog</UiText>
        </div>

        <div className="space-y-1">
          <UiText variant="caption" tone="muted">variant="subheading"</UiText>
          <UiText variant="subheading">The quick brown fox jumps over the lazy dog</UiText>
        </div>

        <div className="space-y-1">
          <UiText variant="caption" tone="muted">variant="body"</UiText>
          <UiText variant="body">The quick brown fox jumps over the lazy dog</UiText>
        </div>

        <div className="space-y-1">
          <UiText variant="caption" tone="muted">variant="caption"</UiText>
          <UiText variant="caption">The quick brown fox jumps over the lazy dog</UiText>
        </div>
      </div>

      <div>
        <UiText variant="subheading" gutterBottom>Tones</UiText>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          <UiText variant="body" tone="default">Default Tone</UiText>
          <UiText variant="body" tone="secondary">Secondary Tone</UiText>
          <UiText variant="body" tone="muted">Muted Tone</UiText>
          <UiText variant="body" tone="danger">Danger Tone</UiText>
          <UiText variant="body" tone="success">Success Tone</UiText>
          <UiText variant="body" tone="warning">Warning Tone</UiText>
          <UiText variant="body" tone="info">Info Tone</UiText>
        </div>
      </div>
    </div>
  );
};
