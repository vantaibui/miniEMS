import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, Typography } from '@mui/material';

import { UiButton } from '@libs/ui';

const DEFAULT_MAX_FILE_SIZE_KB = 20;
const DEFAULT_ACCEPTED_EXTENSIONS: Array<string> = ['.crt', '.pem', '.key'];

interface UploadFiledProps {
  acceptedExtensions?: Array<string>;
  maxFileSizeKb?: number;
  selectedFileName?: string;
  onFileLoaded: (payload: {
    file: File;
    fileName: string;
    content: string;
  }) => void;
  onInvalidFile?: (message: string) => void;
}

export const UploadFiled = ({
  acceptedExtensions = DEFAULT_ACCEPTED_EXTENSIONS,
  maxFileSizeKb = DEFAULT_MAX_FILE_SIZE_KB,
  selectedFileName,
  onFileLoaded,
  onInvalidFile,
}: UploadFiledProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const processFile = (file: File) => {
    const lowerName = file.name.toLowerCase();
    const isAllowedType = acceptedExtensions.some((ext) =>
      lowerName.endsWith(ext.toLowerCase()),
    );

    if (!isAllowedType) {
      onInvalidFile?.(
        `Invalid file type. Accepted: ${acceptedExtensions.join(', ')}`,
      );
      resetInput();
      return;
    }

    const maxFileSizeBytes = maxFileSizeKb * 1024;
    if (file.size > maxFileSizeBytes) {
      onInvalidFile?.(
        `Certificate file size must be less than or equal to ${maxFileSizeKb}KB.`,
      );
      resetInput();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onFileLoaded({
        file,
        fileName: file.name,
        content: String(reader.result ?? ''),
      });
    };
    reader.readAsText(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  return (
    <Box
      className={`rounded-lg border border-dashed bg-background p-3 transition-colors ${
        isDragging ? 'border-primary' : 'border-divider'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <FileUploadOutlinedIcon color="primary" sx={{ fontSize: 28, mt: 0.25 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.25 }}>
              Certificate Upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accepted: {acceptedExtensions.join(', ')}. Max size: {maxFileSizeKb}KB
            </Typography>
            {selectedFileName ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.75, wordBreak: 'break-all' }}
              >
                Selected file: {selectedFileName}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <UiButton variant="contained" component="label">
          Browse Files
          <input
            ref={inputRef}
            type="file"
            hidden
            accept={acceptedExtensions.join(',')}
            onChange={handleChange}
          />
        </UiButton>
      </Box>
    </Box>
  );
};
