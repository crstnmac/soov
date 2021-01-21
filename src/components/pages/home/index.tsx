import React, { useState, useEffect, useRef } from 'react'
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
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable
} from 'react-native'
import { useGeneralContext } from 'src/contexts/general'
import { RootStackNavigator } from 'src/navigator'
import { hexToRgba } from 'src/utils'
import { render } from '@testing-library/react-native'
import { Modalize } from 'react-native-modalize'
import { color } from 'react-native-reanimated'

export default function (): JSX.Element {
  const generalContext = useGeneralContext()

  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackNavigator>
  >()

  const theme = useTheme()

  interface ITask {
    title: string
    description: string
    completed: boolean
  }

  const [tasks, setTasks] = useState<ITask[]>([])

  const modalizeRef = useRef<Modalize>(null)

  const onOpen = () => {
    modalizeRef.current?.open()
  }

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

  const removeTask = (index: number): void => {
    const newTaskList = [...tasks]
    newTaskList.splice(index, 1)
    setTasks(newTaskList)
  }

  const toggleComplete = (index: number): void => {
    const newTaskLIst = [...tasks]
    newTaskLIst[index].completed = !newTaskLIst[index].completed
    setTasks(newTaskLIst)
    console.log(newTaskLIst)
  }

  function SearchTask(): JSX.Element {
    const [search, setSearch] = useState('')
    const [filteredDataSource, setFilteredDataSource] = useState([])

    const searchFilterFunction = text => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = tasks.filter(function (item) {
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
        setFilteredDataSource(tasks)
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
        {tasks.length === 0 && (
          <Text textAlign="center" type="h4">
            No tasks available !!!
          </Text>
        )}
        <Flex paddingHorizontal="medium">
          {filteredDataSource.map((item, index) => (
            <Flex key={index} marginTop="tiny">
              <ListItem
                title={item.title}
                description={item.description}
                time={item.time}
                completed={item.completed}
                onPress={() => toggleComplete(index)}
                onLongPress={() => removeTask(index)}
              />
            </Flex>
          ))}
        </Flex>
      </>
    )
  }

  function AddTaskComponent(): JSX.Element {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, showError] = useState<Boolean>(false)
    const handleSubmit = (): void => {
      Keyboard.dismiss()
      modalizeRef.current?.close()
      if ((title.trim(), description.trim()))
        setTasks([
          ...tasks,
          { title: title, description: description, completed: false }
        ])
      else showError(true)
      setTitle('')
      setDescription('')
    }

    return (
      <>
        <Input
          value={title}
          onChangeText={e => {
            setTitle(e)
          }}
          autoFocus
          placeholder="Enter wish name"
          blurOnSubmit={false}
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
        <Button title="Add" onPress={handleSubmit} />
      </>
    )
  }

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
          {tasks.map((item, index) => (
            <Flex key={index} marginTop="tiny">
              <ListItem
                title={item.title}
                description={item.description}
                time={item.time}
                completed={item.completed}
                onPress={() => toggleComplete(index)}
                onLongPress={() => removeTask(index)}
              />
            </Flex>
          ))}
        </Flex>
      </ScrollViewFaded>
      <Flex paddingHorizontal="medium" paddingVertical="small">
        <Button type="primary" title="Add a wish" onPress={onOpen} />
      </Flex>

      <Modalize
        ref={modalizeRef}
        snapPoint={450}
        withHandle={true}
        handlePosition="inside"
        adjustToContentHeight={true}
        modalStyle={{
          backgroundColor: theme.colors.systemBackgroundPrimary
        }}
      >
        <Flex marginHorizontal="medium" marginVertical="small">
          {<AddTaskComponent />}
        </Flex>
      </Modalize>
    </>
  )
}
