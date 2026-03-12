import { UiButton } from '@libs/ui';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, Typography } from '@mui/material';
import type { ChangeEvent, DragEvent } from 'react';
import { useRef, useState } from 'react';

const DEFAULT_MAX_FILE_SIZE_KB = 20;
const DEFAULT_ACCEPTED_EXTENSIONS: Array<string> = ['.crt', '.pem', '.key'];

interface UploadFiledProps {
  acceptedExtensions?: Array<string>;
  maxFileSizeKb?: number;
  selectedFileName?: string;
  onFileLoaded: (payload: { file: File; fileName: string; content: string }) => void;
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
    const isAllowedType = acceptedExtensions.some((ext) => lowerName.endsWith(ext.toLowerCase()));

    if (!isAllowedType) {
      onInvalidFile?.(`Invalid file type. Accepted: ${acceptedExtensions.join(', ')}`);
      resetInput();
      return;
    }

    const maxFileSizeBytes = maxFileSizeKb * 1024;
    if (file.size > maxFileSizeBytes) {
      onInvalidFile?.(`Certificate file size must be less than or equal to ${maxFileSizeKb}KB.`);
      resetInput();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onFileLoaded({ file, fileName: file.name, content: String(reader.result ?? '') });
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
      className={`rounded-lg border border-dashed bg-background p-3 text-center transition-colors md:p-4 ${
        isDragging ? 'border-primary' : 'border-divider'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FileUploadOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1.5 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Certificate Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Drag and drop your certificate files ({acceptedExtensions.join(', ')}) here to secure your connection.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Maximum size: {maxFileSizeKb}KB
      </Typography>
      <UiButton variant="contained" component="label">
        Browse Files
        <input ref={inputRef} type="file" hidden accept={acceptedExtensions.join(',')} onChange={handleChange} />
      </UiButton>
      {selectedFileName ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          Selected file: {selectedFileName}
        </Typography>
      ) : null}
    </Box>
  );
};
