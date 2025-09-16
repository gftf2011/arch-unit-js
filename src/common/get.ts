export interface Get<INPUT, OUTPUT> {
  get(input: INPUT): OUTPUT;
}

export interface NullaryGet<OUTPUT> extends Get<null, OUTPUT> {
  get(): OUTPUT;
}
