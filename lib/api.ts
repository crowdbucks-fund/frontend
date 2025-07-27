import API from '@xeronith/granola';

const baseApi = new API(process.env.NEXT_PUBLIC_API_BASE as string, {
  // suppressConsoleOutput: process.env.NODE_ENV === 'production',
})

export const api = new Proxy(baseApi, {
  get(target, prop, receiver) {
    return async (...args: any[]) => {
      if (prop === "addOrUpdateCommunityByUser" && args[0]?._handle) {
        // @ts-ignore
        args[0].handle = args[0]._handle;
      }
      // @ts-ignore
      return target[prop](...args);
    };
  }
});

// export const api = baseApi

export type ApiError = { message: string }

