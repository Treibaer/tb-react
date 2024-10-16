
export type Wrapper<T> = {
  type: string;
  data: T;
};

export type Listener = {
  event: string;
  type: string;
  fn: (value: Wrapper<any>) => void;
};

export type EmitFunction = (event: string, type: string, data: any) => void;
