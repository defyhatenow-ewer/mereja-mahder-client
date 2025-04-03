import axios from "axios";
import { toast } from "react-toastify";
import { config } from "../config";
import { useEffect, useState } from "react";

/**
 * Uploads an image to cloudinary
 * @param file file to be uploaded to cloudinary
 */
const uploadImage = async (file: File) => {
  try {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", config.cloudinaryPreset);
    uploadData.append("cloud_name", config.cloudinaryName);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${config.cloudinaryName}/image/upload`,
      uploadData,
    );
    return data.secure_url as string;
  } catch (error) {
    console.error(error);
    toast.error(
      "It seems there is a problem with the image uploader. Contact admin",
    );
    return null;
  }
};

export const useUploadImage = (file: File | null): [string | null, boolean] => {
  const [url, setUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (file) {
      setIsUploading(true);
      const uploadImage = async (file: File) => {
        try {
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", config.cloudinaryPreset);
          uploadData.append("cloud_name", config.cloudinaryName);
          const { data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${config.cloudinaryName}/image/upload`,
            uploadData,
          );
          setUrl(data.secure_url as string);
        } catch (error) {
          console.error(error);
          toast.error(
            "It seems there is a problem with the image uploader. Contact admin",
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

export default uploadImage;
