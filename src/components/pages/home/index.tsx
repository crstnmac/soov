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
import { View } from 'react-native'
import { useGeneralContext } from 'src/contexts/general'
import { RootStackNavigator } from 'src/navigator'
import { hexToRgba } from 'src/utils'
import { render } from '@testing-library/react-native'
import { Modalize } from 'react-native-modalize'

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
      headerRight: () => (
        <Button
          onPress={() => {
            navigation.navigate('MakeSomething')
          }}
          size="small"
          title="Make"
          type="tertiary"
        />
      ),
      headerCenter: () => <Text type="h3"> Soov</Text>
    })
  }, [navigation])

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
          left={({ alpha, color }) => <Icon.SearchIcon {...{ alpha, color }} />}
          onChangeText={text => searchFilterFunction(text)}
          value={search}
          placeholder="Search"
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
      if ((title.trim(), description.trim()))
        modalizeRef.current?.close(),
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
          placeholder="Enter task name"
        />

        <Input
          value={description}
          onChangeText={e => {
            setDescription(e)
          }}
          placeholder="Enter task description"
        />
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
      <Flex paddingHorizontal="medium">
        <Button type="primary" title="Add" onPress={onOpen} />
        <Space size="small" />
      </Flex>

      <Modalize
        ref={modalizeRef}
        snapPoint={450}
        withHandle={true}
        handlePosition="inside"
      >
        <Flex marginHorizontal="small" marginVertical="small">
          {<AddTaskComponent />}
        </Flex>
      </Modalize>
    </>
  )
}
