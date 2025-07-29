import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '../config';
import { sha1 } from '.';

/**
 * Uploads an image to cloudinary
 * @param file file to be uploaded to cloudinary
 */
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
    return data.secure_url as string;
  } catch (error) {
    console.error(error);
    toast.error(
      'It seems there is a problem with the image uploader. Contact admin'
    );
    return null;
  }
};

export default uploadImage;
