import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query"
import { UserBankInfo } from '@xeronith/granola/core/objects'
import { api } from 'lib/api'

export const useBankInfos = (options: Omit<UndefinedInitialDataOptions<UserBankInfo[], unknown, UserBankInfo[], string[]>, 'queryKey'> = {}) => {
  return useQuery({
    ...options,
    queryKey: ['getBankInfosByUser'],
    queryFn: async () => (await api.getBankInfosByUser({})).bankInfos,
  })
}
