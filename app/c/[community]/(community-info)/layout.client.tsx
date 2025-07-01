'use client'
import { AuthWizardContent } from 'app/auth/components/AuthWizard'
import { ResponsiveDialog } from 'components/ResponsiveDialog'
import { queryClient } from 'lib/reactQuery'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useAuth } from 'states/console/user'

const SignInModal: FC<{ isOpen: boolean; onSignin: (token: string) => Promise<void> }> = ({ isOpen, onSignin }) => {
  return (
    <ResponsiveDialog showCloseButton={false} isOpen={isOpen} onClose={() => {}} title="" showTitleOnMobile={false}>
      <AuthWizardContent
        content={{
          email: {
            title: 'Let us know your email',
            // description: 'Let us know your email',
          },
        }}
        onSignIn={onSignin}
        step="email"
        changeRouteOnCompleteSteps={false}
      />
    </ResponsiveDialog>
  )
}

export default function CommunityInfoLayoutClient({ children, onAuthorize }: PropsWithChildren<{ onAuthorize: (token: string) => Promise<void> }>) {
  const { user, isFetching } = useAuth({
    onError(err) {},
  })

  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    if (!user && !isFetching) setIsAuthorized(false)
  }, [user, isFetching])

  const onAuthorized = async (token: string) => {
    setIsAuthorized(true)
    await onAuthorize(token)
    queryClient.invalidateQueries()
  }

  return (
    <>
      {children}
      <SignInModal isOpen={!isAuthorized} onSignin={onAuthorized} />
    </>
  )
}
