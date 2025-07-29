import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { config } from '../config';
import { sha1 } from '../utils';

const useUploadImage = (file: File | null): [string | null, boolean] => {
  const [url, setUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (file) {
      setIsUploading(true);
      const uploadImage = async (file: File) => {
        try {
          const timestamp = Math.floor(Date.now() / 1000).toString();

          const signatureString = `timestamp=${timestamp}${config.env.cloudinaryApiSecret}`;
          const signature = await sha1(signatureString);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('timestamp', timestamp);
          formData.append('api_key', config.env.cloudinaryApiKey);
          formData.append('signature', signature);

          const { data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${config.env.cloudinaryName}/image/upload`,
            formData
          );

          setUrl(data.secure_url as string);
        } catch (error) {
          console.error(error);
          toast.error(
            'It seems there is a problem with the image uploader. Contact admin'
          );
        } finally {
          setIsUploading(false);
        }
      };
      uploadImage(file);
    }
  }, [file]);

  return [url, isUploading];
};

export default useUploadImage;
