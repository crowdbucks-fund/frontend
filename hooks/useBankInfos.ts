import { UserBankInfo } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'
import { UseQueryOptions, useQuery } from 'react-query'

export const useBankInfos = (options: UseQueryOptions<UserBankInfo[], unknown, UserBankInfo[], string[]> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getBankInfosByUser'],
    queryFn: async () => (await api.getBankInfosByUser({})).bankInfos,
  })
}
