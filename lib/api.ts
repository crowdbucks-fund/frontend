import API from '@xeronith/granola';

const baseApi = new API(process.env.NEXT_PUBLIC_API_BASE as string, {
  suppressConsoleOutput: process.env.NODE_ENV === 'production',
})

// export const api = new Proxy(baseApi, {
//   get(target, prop, receiver) {
//     return async (...args: any[]) => {
//       if (isServer) {
//         console.log('is server', undefined);
//         // @ts-ignore
//         return target[prop](args[0], { token: undefined, ...(args[1] || {}) });
//       }
//       // @ts-ignore
//       return target[prop](...args);
//     };
//   }
// });

export const api = baseApi

export type ApiError = { message: string }

