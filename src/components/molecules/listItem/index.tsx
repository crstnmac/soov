import React, { useCallback, useMemo } from 'react'
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleSheet
} from 'react-native'
import { DefaultTheme, useTheme } from 'styled-components/native'
import normalize from 'react-native-normalize'
import Color from 'color'

import { Flex, Text } from 'src/components/atoms'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { color } from 'react-native-reanimated'

type Props = PressableProps & {
  title?: string
  description?: string
  completed?: boolean
}

export default function ({
  title,
  description,
  completed,
  ...props
}: Props): JSX.Element {
  const theme = useTheme()

  const style: PressableProps['style'] = useCallback(
    ({ pressed }: PressableStateCallbackType) => {
      const _style: PressableProps['style'] = {
        opacity: 1,
        backgroundColor: theme.colors.systemBackgroundSecondary,
        borderRadius: 16
      }

      if (pressed) {
        _style.opacity = 0.5
        _style.backgroundColor = Color(theme.colors.systemBackgroundPrimary)
          .darken(0.1)
          .toString()
      }

      return _style
    },
    [title, description, completed]
  )

  return (
    <Pressable {...{ style, ...props }}>
      <Flex
        flexDirection="column"
        paddingHorizontal="small"
        paddingVertical="small"
      >
        <Flex flexDirection="row" justifyContent="space-between">
          <Text
            style={[
              { textDecorationLine: completed ? 'line-through' : 'none' }
            ]}
            type="subtitle1"
          >
            {title}
          </Text>
        </Flex>
        <Text
          style={[{ textDecorationLine: completed ? 'line-through' : 'none' }]}
          type="subtitle2"
        >
          {description}
        </Text>
      </Flex>
    </Pressable>
  )
}
