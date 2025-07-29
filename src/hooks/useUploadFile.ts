import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '../config';
import { sha1 } from '../utils';

export const useUploadFile = (
  file: File | null,
  options?: {
    folder?: string;
    tags?: string[];
  }
): [string | null, boolean] => {
  const [url, setUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!file) return;

    const uploadFile = async () => {
      setIsUploading(true);

      try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const folder = options?.folder || '';
        const tags = options?.tags?.join(',') || '';

        // Build signature string — only include params that are sent
        let signatureBase = `timestamp=${timestamp}`;
        if (folder) signatureBase += `&folder=${folder}`;
        if (tags) signatureBase += `&tags=${tags}`;
        signatureBase += config.env.cloudinaryApiSecret;

        const signature = await sha1(signatureBase);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', timestamp);
        formData.append('api_key', config.env.cloudinaryApiKey);
        formData.append('signature', signature);
        if (folder) formData.append('folder', folder);
        if (tags) formData.append('tags', tags);

        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/${config.env.cloudinaryName}/auto/upload`,
          formData
        );

        setUrl(data.secure_url as string);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('File upload failed.');
      } finally {
        setIsUploading(false);
      }
    };

    uploadFile();
  }, [file, options]);

  return [url, isUploading];
};
