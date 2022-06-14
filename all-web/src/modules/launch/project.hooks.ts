import { useAsync } from 'react-use'
import { connection } from '../../config/config'
import { trpc } from '../../utils/trpc'

export const useGetProjectsOverview = () => {
  return useAsync(async () => {
    
  }, [connection])
}