// flow-typed signature: e403043476bf936e6305d13b0f9a3c43
// flow-typed version: 92ea3bd910/nanoid_v1.0.x/flow_>=v0.50.x

declare module "nanoid" {
  declare module.exports: (size?: number) => string;
}

declare module "nanoid/format" {
  declare module.exports: (
    random: (size: number) => string[],
    alphabet: string,
    size: number
  ) => string;
}

declare module "nanoid/generate" {
  declare module.exports: (alphabet: string, size: number) => string;
}

declare module "nanoid/url" {
  declare module.exports: string;
}
