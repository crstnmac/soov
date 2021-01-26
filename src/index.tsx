import 'react-native-gesture-handler'

import React from 'react'
import { StatusBar } from 'react-native'
import { ThemeProvider } from 'styled-components/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import GeneralProvider, { useGeneralContext } from './contexts/general'
import DatabaseContextProvider, {
  useDatabaseContext
} from './contexts/database'
import Navigator from './navigator'
import DefaultTheme, { darkColors } from './theme'

function Wrap(): JSX.Element {
  const generalContext = useGeneralContext()

  const theme = {
    ...DefaultTheme,
    ...(generalContext.darkMode ? { colors: darkColors } : {})
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider
        {...{
          theme
        }}
      >
        <DatabaseContextProvider>
          <StatusBar
            animated
            backgroundColor={theme.colors.transparent}
            barStyle={
              generalContext.darkMode ? 'light-content' : 'dark-content'
            }
            translucent
          />
          <Navigator />
        </DatabaseContextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

function App(): JSX.Element {
  return (
    <GeneralProvider>
      <Wrap />
    </GeneralProvider>
  )
}

export default App
