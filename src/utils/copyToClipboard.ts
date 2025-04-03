import { toast } from "react-toastify";

/**
 * Copies given text to clipboard
 * @param text text to copy
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  } catch (err) {
    console.error(err);
    toast.error("Failed to copy!");
  }
};

export default copyToClipboard;
