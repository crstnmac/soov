import React, { createContext, useState, useEffect, useContext } from 'react'
import SQLite from 'react-native-sqlite-storage'

type Props = PropsWithChildren<{
  //
}>

export interface DatabaseContextValues {
  wishes: IWish[]
  getWishes(): Promise<void>
  addWish(title: string, description: string): Promise<void>
  removeWish(index: number): Promise<void>
  updateCompleted(index: number): Promise<void>
}

interface IWish {
  title: string
  description: string
  completed: boolean
}

export const DatabaseContext = createContext<DatabaseContextValues>(
  {} as DatabaseContextValues
)

export function useDatabaseContext(): DatabaseContextValues {
  return useContext(DatabaseContext)
}

export default function ({ children }: Props): JSX.Element {
  const [wishes, setWishes] = useState<IWish[]>([])
  const db = SQLite.openDatabase({
    name: 'test.db',
    location: 'default',
    androidDatabaseProvide: 'system'
  })

  useEffect(() => {
    db.transaction(tx => {
      console.log('again in')
      //tx.executeSql('DROP TABLE WISHES')
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS WISHES (title TEXT NOT NULL, description TEXT, completed INTEGER NOT NULL);',
        [],
        (tx, result) => {}
      )
    })
  }, [])
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM WISHES;', [], (tx, result) => {
        const data = []
        for (let i = 0; i < result.rows.length; i++) {
          data.push(result.rows.item(i))
        }
        setWishes(data)
      })
    })
  }, [])

  const addWish = (title: string, description: string) => {
    db.transaction(tx => {
      console.log('adding...')
      tx.executeSql(
        `INSERT INTO WISHES(title,description,completed) VALUES(?,?,0);`,
        [title, description],
        (tx, result) => {
          console.log('here =>', result.insertId)
          setWishes(prevState => [...prevState, { title, description }])
        }
      )
    })
  }

  const updateCompleted = (index: number) => {
    db.transaction(tx => {
      console.log('updating...')
      const wish = wishes[index].title

      const doneNumber = wishes[index].completed ? 0 : 1

      console.log(wish)

      tx.executeSql(
        `UPDATE WISHES SET completed = "${doneNumber}" where title="${wish}";`,
        [],
        (tx, result) => {
          console.log(`completed => `, result)
          const data = [...wishes]
          data[index].completed = doneNumber
          setWishes(data)
        }
      )
    })
  }

  const removeWish = (index: number) => {
    db.transaction(tx => {
      const wish = wishes[index].title
      tx.executeSql(
        `DELETE FROM WISHES WHERE title="${wish}";`,
        [],
        (tx, result) => {
          console.log(result)
          setWishes(prevState => prevState.filter((e, i) => i !== index))
        }
      )
    })
  }

  return (
    <DatabaseContext.Provider
      value={{ wishes, addWish, updateCompleted, removeWish }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}
