import { useState, useEffect } from 'react'
import { useAuthContext } from '@asgardeo/auth-react'
import { useDispatch } from 'react-redux'
import { setUser, setLoading } from '../store/slices/authSlice'

export const useAuth = () => {
  const { state, signIn, signOut, getBasicUserInfo, getAccessToken } = useAuthContext()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (state.isAuthenticated) {
          const userInfo = await getBasicUserInfo()
          const accessToken = await getAccessToken()
          
          dispatch(setUser({
            ...userInfo,
            token: accessToken
          }))
        } else {
          dispatch(setUser(null))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        dispatch(setUser(null))
      } finally {
        setIsLoading(false)
        dispatch(setLoading(false))
      }
    }

    initializeAuth()
  }, [state.isAuthenticated, dispatch, getBasicUserInfo, getAccessToken])

  const login = async () => {
    try {
      dispatch(setLoading(true))
      await signIn()
    } catch (error) {
      console.error('Login error:', error)
      dispatch(setLoading(false))
    }
  }

  const logout = async () => {
    try {
      dispatch(setLoading(true))
      await signOut()
      dispatch(setUser(null))
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return {
    isAuthenticated: state.isAuthenticated,
    isLoading,
    login,
    logout,
    user: state.user
  }
}