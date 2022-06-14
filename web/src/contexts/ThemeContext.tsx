import { createContext, FC, useState, useCallback } from 'react'
import themeFlat from '../themeFlat'
import { ChakraProvider } from '@chakra-ui/react'

export const ThemeContext = createContext<any>(null)

export const ThemeProvider: FC = ({ children }) => {
  // We can handle dark/light mode here
  const [theme, setTheme] = useState(themeFlat)

  // Not used currently, but will be used if we have more themes
  const changeTheme = useCallback((themeName) => {
    if (themeName === 'flat') {
      setTheme(themeFlat)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, changeTheme }}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  )
}
