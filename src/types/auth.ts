export type TSignup = {
  fullName: string;
  email: string;
  password: string;
};

export type TUpdateUser = {
  password?: string;
  fullName?: string;
  avatar?: File;
};
