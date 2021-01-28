import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'
import { useTheme } from 'styled-components/native'

import { Flex, Icon, Space, Text } from 'src/components/atoms'
import {
  Button,
  Input,
  ScrollViewFaded,
  ListItem
} from 'src/components/molecules'
import {
  View,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable,
  Keyboard
} from 'react-native'
import { useGeneralContext } from 'src/contexts/general'
import { useDatabaseContext } from 'src/contexts/database'
import { RootStackNavigator } from 'src/navigator'
import { hexToRgba } from 'src/utils'
import { render } from '@testing-library/react-native'
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackgroundProps
} from '@gorhom/bottom-sheet'
import { color } from 'react-native-reanimated'
import Color from 'color'

export default function (): JSX.Element {
  const generalContext = useGeneralContext()

  const { wishes, addWish, removeWish, updateCompleted } = useDatabaseContext()

  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackNavigator>
  >()

  const theme = useTheme()

  const bottomSheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Flex
          justifyContent="center"
          alignItems="center"
          paddingTop="small"
          paddingLeft="small"
        >
          <Pressable
            onPress={() => {
              generalContext.toggleDarkMode()
            }}
            children={
              generalContext.darkMode ? <Icon.SunIcon /> : <Icon.MoonIcon />
            }
          />
        </Flex>
      ),
      headerCenter: () => <Text type="h3"> Soov</Text>,
      headerRight: () => (
        <Button
          onPress={() => {
            navigation.navigate('MakeSomething')
          }}
          size="small"
          title="Make"
          type="tertiary"
        />
      )
    })
  }, [navigation, generalContext, color])

  function SearchTask(): JSX.Element {
    const [search, setSearch] = useState('')
    const [filteredDataSource, setFilteredDataSource] = useState([])

    const searchFilterFunction = text => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = wishes.filter(function (item) {
          const itemData = item.title
            ? item.title.toUpperCase()
            : ''.toUpperCase()
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) > -1
        })
        setFilteredDataSource(newData)
        setSearch(text)
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(wishes)
        setSearch(text)
      }
    }

    return (
      <>
        <Input
          right={({ alpha, color }) => (
            <Icon.SearchIcon {...{ alpha, color }} />
          )}
          onChangeText={text => searchFilterFunction(text)}
          value={search}
          placeholder="Search a wish"
        />
        <Space size="small" />
        {wishes.length === 0 && (
          <Text textAlign="center" type="h4">
            No wishes available !!!
          </Text>
        )}
        <Flex paddingHorizontal="medium">
          {filteredDataSource.map((item, index) => (
            <Flex key={index} marginTop="tiny">
              <ListItem
                title={item.title}
                description={item.description}
                completed={item.completed}
                onPress={() => updateCompleted(index)}
                onLongPress={() => removeWish(index)}
              />
            </Flex>
          ))}
        </Flex>
      </>
    )
  }

  function BottomSheetComponent(): JSX.Element {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, showError] = useState<Boolean>(false)

    const onOpen = useCallback(() => {
      bottomSheetRef.current?.expand()
    }, [])

    const onCLose = useCallback(() => {
      bottomSheetRef.current?.close()
    }, [])

    const handleSubmit = useCallback((): void => {
      if (title.trim()) {
        addWish(title, description)
        setTitle('')
        setDescription('')
        onCLose('')
      } else showError(true)
      onCLose('')
    }, [title, description])

    const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
      // styles
      const containerStyle = useMemo(
        () => [
          style,
          {
            backgroundColor: theme.colors.systemBackgroundPrimary
          }
        ],
        [style, theme.colors]
      )

      return <View style={containerStyle} />
    }

    return (
      <>
        <Flex paddingHorizontal="medium" paddingVertical="small">
          <Button type="primary" title="Add a wish" onPress={onOpen} />
        </Flex>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          backgroundComponent={CustomBackground}
        >
          <BottomSheetView>
            <Flex marginHorizontal="medium" marginVertical="small">
              <Input
                value={title}
                onChangeText={e => {
                  setTitle(e)
                }}
                placeholder="Enter wish name"
              />

              <Input
                value={description}
                onChangeText={e => {
                  setDescription(e)
                }}
                placeholder="Enter wish description"
                multiline
                numberOfLines={3}
                maxLength={140}
                height={80}
              />
              <Flex alignItems="flex-end">
                <Text type="h4"> {description.length}/140</Text>
              </Flex>
              <Space size="small" />
              <Button
                title="Add"
                onPress={() => {
                  onCLose, handleSubmit()
                }}
              />
            </Flex>
          </BottomSheetView>
        </BottomSheet>
      </>
    )
  }

  const snapPoints = useMemo(() => [0, '100%'], [])

  return (
    <>
      <Flex paddingHorizontal="medium">{<SearchTask />}</Flex>
      <ScrollViewFaded
        colors={{
          bottom: [
            hexToRgba(theme.colors.systemBackgroundPrimary, 0),
            theme.colors.systemBackgroundPrimary
          ],
          top: [
            theme.colors.systemBackgroundPrimary,
            hexToRgba(theme.colors.systemBackgroundPrimary, 0)
          ]
        }}
        disableTopInset
      >
        <Flex paddingHorizontal="medium">
          {wishes.map((item, index) => (
            <Flex key={index} marginTop="tiny">
              <ListItem
                title={item.title}
                description={item.description}
                time={item.time}
                completed={item.completed === 1}
                onPress={() => updateCompleted(index)}
                onLongPress={() => removeWish(index)}
              />
            </Flex>
          ))}
        </Flex>
      </ScrollViewFaded>

      {<BottomSheetComponent />}
    </>
  )
}
