import { Grid, Heading, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { trpc } from '../../../../utils/trpc'
import { SwitchBox } from '../SwitchBox'
import { useUser } from '../../../../modules/common/authHooks'

interface Props {}

export const ManageNotifications: FC<Props> = () => {
  const updateMutation = trpc.useMutation('launch.updateNotifications')
  const { data: user } = useUser()

  const [formData, setFormData] = useState({
    notifyNewProject: false,
    notifyMintStart: false,
    notifyNewWhitelist: false,
  })

  useEffect(() => {
    setFormData({
      notifyNewProject: !!user?.notifyNewProject,
      notifyMintStart: !!user?.notifyMintStart,
      notifyNewWhitelist: !!user?.notifyNewWhitelist,
    })
  }, [user])

  const handleChange = useCallback(
    (fieldName) => async (value: boolean) => {
      try {
        const data = {
          ...formData,
          [fieldName]: value,
        }

        await updateMutation.mutateAsync({
          ...data,
        })

        setFormData(data)

        toast.success('Updated successfully')
      } catch (e) {
        console.log('Update notification err:', e)
        toast.error('Failed')
      }
    },
    [formData]
  )

  return (
    <Stack spacing='2rem'>
      <Stack>
        <Heading fontSize={'1.5rem'} fontWeight={600}>
          Manage Notifications
        </Heading>
        <Text
          fontSize={'0.875rem'}
          color='#888888'
          fontWeight={400}
          maxW={'35.375rem'}
        >
          We can update you on the latest mints, new projects and whitelists by
          sending you an Email.
        </Text>
      </Stack>

      <Grid templateColumns={['repeat(1, 1fr)']} gap={6} maxW='23rem'>
        <SwitchBox
          label='New projects'
          checked={formData.notifyNewProject}
          onChange={handleChange('notifyNewProject')}
        />
        <SwitchBox
          label='Mint starts for a saved project'
          checked={formData.notifyMintStart}
          onChange={handleChange('notifyMintStart')}
        />
        <SwitchBox
          label='New whitelisted project'
          checked={formData.notifyNewWhitelist}
          onChange={handleChange('notifyNewWhitelist')}
        />
      </Grid>
    </Stack>
  )
}
