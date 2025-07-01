export const maskString = (str: string, maskIcon: string = '*') => str.substring(0, 4) + maskIcon.repeat(Math.max(str.length - 8, 0)) + str.substring(str.length - 4)
export const maskEmail = (str: string) => str.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c)
