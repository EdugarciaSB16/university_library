'use client';
import config from '@/lib/config';
import ImageKit from 'imagekit';
import { IKImage, IKUpload, IKVideo, ImageKitProvider } from 'imagekitio-next';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    const { signature, token, expire } = data;

    return {
      signature,
      token,
      expire,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: 'image' | 'video';
  accept: string;
  placeholder: string;
  folder: string;
  variant: 'dark' | 'light';
  onFileChange: (filePath: string) => void;
  value?: string;
}

const ImageUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === 'dark'
        ? 'bg-dark-300'
        : 'bg-light-600 border-gray-100 border',
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
  };

  const onError = (error: any) => {
    console.error(error);
    toast({
      title: `${type} upload failed`,
      description: `An ${type} occurred while uploading the image.`,
      variant: 'destructive',
    });
  };

  const onSuccess = (response: any) => {
    setFile(response);
    onFileChange(response.filePath);

    toast({
      title: `${type} uploaded successfully`,
      description: `${response.filePath} has been successfully uploaded.`,
    });
  };

  const onValidate = (file: File) => {
    if (type === 'image') {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: 'File size too large',
          description: 'Please upload a file that is less than 20MB in size',
          variant: 'destructive',
        });
        return false;
      }
    } else if (type === 'video') {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'File size too large',
          description: 'Please upload a file that is less than 50MB in size',
          variant: 'destructive',
        });
      }
    }

    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);

          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />
      <button
        className={cn('upload-btn', styles.button)}
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="Upload Icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn('text-base', styles.placeholder)}>{placeholder}</p>

        {file && (
          <p className={cn('upload-filename', styles.text)}>{file.filePath}</p>
        )}
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file &&
        (type === 'image' ? (
          <IKImage
            path={file.filePath}
            alt={file.filePath}
            width={500}
            height={300}
          />
        ) : type === 'video' ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default ImageUpload;
