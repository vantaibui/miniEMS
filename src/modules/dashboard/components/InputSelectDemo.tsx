import { UiInput, UiSelect, UiText, UiFormField } from '@libs/ui';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

/**
 * Demo for Inputs and Selects.
 * Best practice: Always wrap inputs in UiFormField for consistent labels and error states.
 */
export const InputSelectDemo = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <UiText variant="heading" gutterBottom>
          Inputs & Selects
        </UiText>
        <UiText variant="caption" tone="secondary">
          Demonstrates basic input types, selects, and their various states.
        </UiText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Inputs */}
        <div className="space-y-4">
          <UiText variant="subheading">Input Variants</UiText>
          <UiFormField label="Default Input">
            <UiInput placeholder="Enter something..." />
          </UiFormField>
          <UiFormField label="Disabled Input">
            <UiInput disabled placeholder="Can't type here" />
          </UiFormField>
          <UiFormField label="Loading Input">
            <UiInput loading placeholder="Fetching data..." />
          </UiFormField>
          <UiFormField label="Error Input" errorText="This field is required">
            <UiInput defaultValue="Invalid value" />
          </UiFormField>
        </div>

        {/* Selects */}
        <div className="space-y-4">
          <UiText variant="subheading">Select Variants</UiText>
          <UiFormField label="Standard Select">
            <UiSelect options={roleOptions} placeholder="Select a role" />
          </UiFormField>
          <UiFormField label="Disabled Select">
            <UiSelect disabled options={roleOptions} placeholder="Select a role" />
          </UiFormField>
          <UiFormField label="Loading Select">
            <UiSelect loading options={roleOptions} placeholder="Select a role" />
          </UiFormField>
          <UiFormField label="Select with Error" errorText="Please select a role">
            <UiSelect options={roleOptions} placeholder="Select a role" />
          </UiFormField>
        </div>
      </div>

      <div className="space-y-4">
        <UiText variant="subheading">Sizes</UiText>
        <div className="flex flex-col gap-4 max-w-md">
          <UiInput size="sm" placeholder="Small input" />
          <UiInput size="md" placeholder="Medium input" />
          <UiInput size="lg" placeholder="Large input" />
        </div>
      </div>
    </div>
  );
};
