import { UseMutateFunction, UseMutationOptions, useMutation } from "@tanstack/react-query"

export const fileUpload = async (file: File) => {
  var formdata = new FormData()

  formdata.append('file', file, file.name)

  return await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/media`, {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  }).then((response): Promise<{ contentType: string; thumbnailUrl: string; url: string; checksum: string }> => response.json())
}

const promisifyFileUpload = (obj: any, promises: Promise<any>[] = [], parentObj: any = null, fieldName: string | null = null) => {
  if (obj)
    for (const child of Object.keys(obj)) {
      if (typeof obj[child] !== 'undefined' && obj[child] !== null) {
        if (typeof obj[child] === 'object') {
          if (obj[child] instanceof File)
            promises.push(
              fileUpload(obj[child]).then((v) => {
                obj[child] = v.url
              })
            )
          else promisifyFileUpload(obj[child], promises, obj, child)
        }
      } else obj[child] = ''
    }
  return promises
}

export const parallelUploader = <T>(obj: T) => {
  return Promise.all(promisifyFileUpload(obj)).then(() => obj)
}

export const useMutationWithFile = (callback: (data: any) => Promise<any>, options: UseMutationOptions) => {
  const fn = async (data: any) => {
    return callback(await parallelUploader(data))
  }
  return useMutation({
    ...options,
    mutationFn: fn,
  })
}

export const mutateOnSubmit = (mutate: UseMutateFunction) => {
  return (values: any) => {
    mutate(values)
  }
}
