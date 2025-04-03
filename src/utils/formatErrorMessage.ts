import { IError } from "../types/IErrorResponse";

/**
 * Formats error response from server
 * @param {any} err error response from server
 * @returns {String} error message as string
 */
const formatErrorMessage = (err: IError | undefined | never): string => {
  if (err) {
    return err.message;
  }
  return "Unknown server error";
};

export default formatErrorMessage;
