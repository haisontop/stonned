import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export const useTheme = () => {
  const { theme, setTheme, changeTheme } = useContext(ThemeContext)

  return {
    theme,
    setTheme,
    changeTheme,
  }
}
