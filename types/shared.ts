export type Message = {
  success: true;
};
export type ErrorMessage = {
  success: false;
  msg: string;
  code?: string;
};
