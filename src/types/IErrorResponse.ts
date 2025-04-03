export type IError = {
  message: string;
};

export default interface IErrorResponse {
  status: number;
  data: {
    errors: IError[];
  };
}
