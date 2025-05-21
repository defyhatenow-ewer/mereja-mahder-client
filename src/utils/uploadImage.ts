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
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(timestamp);

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("api_key", config.env.cloudinaryApiKey);
    uploadData.append("timestamp", timestamp.toString());
    uploadData.append("signature", signature);
    uploadData.append("cloud_name", config.env.cloudinaryName);
    uploadData.append("asset_folder", "payload-media");
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${config.env.cloudinaryName}/image/upload`,
      uploadData
    );
    return data.secure_url as string;
  } catch (error) {
    console.error(error);
    toast.error(
      "It seems there is a problem with the image uploader. Contact admin"
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
          const timestamp = Math.round(new Date().getTime() / 1000);
          const signature = await generateSignature(timestamp);

          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("api_key", config.env.cloudinaryApiKey);
          uploadData.append("timestamp", timestamp.toString());
          uploadData.append("signature", signature);
          uploadData.append("cloud_name", config.env.cloudinaryName);
          uploadData.append("asset_folder", "payload-media");

          const { data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${config.env.cloudinaryName}/image/upload`,
            uploadData
          );

          setUrl(data.secure_url as string);
        } catch (error) {
          console.error(error);
          toast.error(
            "It seems there is a problem with the image uploader. Contact admin"
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

// Helper function to generate signature
const generateSignature = async (timestamp: number): Promise<string> => {
  const stringToSign = `timestamp=${timestamp}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);

  // Use crypto.subtle for secure signing
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(config.env.cloudinaryApiSecret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signatureArray = await crypto.subtle.sign("HMAC", key, data);

  // Convert the signature array to base64 using browser APIs
  const signatureString = Array.from(new Uint8Array(signatureArray))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return btoa(signatureString);
};

export default uploadImage;
