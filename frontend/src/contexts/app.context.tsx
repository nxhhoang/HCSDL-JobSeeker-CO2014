import { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS, getUserRoleFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  userRole: 'candidate' | 'employer' | 'admin' | null
  setUserRole: React.Dispatch<React.SetStateAction<'candidate' | 'employer' | 'admin' | null>>
  reset: () => void
}

export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  userRole: getUserRoleFromLS(),
  setUserRole: () => null,
  reset: () => null
})

const initialAppContext = getInitialAppContext()

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children: React.ReactNode
  defaultValue?: AppContextInterface
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(defaultValue.profile)
  const [userRole, setUserRole] = useState<'candidate' | 'employer' | 'admin' | null>(defaultValue.userRole)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    setUserRole(null)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        userRole,
        setUserRole,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}