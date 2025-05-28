import {
  Middleware,
  MiddlewareAPI,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { IErrorResponse } from "../types";
import { formatErrorMessage } from "../utils";

export const rtkQueryErrorLogger: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  (_api: MiddlewareAPI) => (next) => (action: any) => {
    if (isRejectedWithValue(action)) {
      if ((action.payload as IErrorResponse).error) {
        toast.error(action.payload.error);
      } else {
        (action.payload as IErrorResponse).data?.errors.forEach((err) => {
          toast.error(formatErrorMessage(err));
        });
      }
    }

    return next(action);
  };
