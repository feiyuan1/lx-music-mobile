import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  type FlatList,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native'
import LogsProvider, { useLogsContext } from './contexts/LogsContext'
import { parseTime } from './utils/date'
import { readTopLogFile } from './utils/fs'
import LogList, { type RenderItem } from './components/LogList'
import { operationType } from './constants'
import NameProvider from './contexts/nameContext'
import useToggle from './hooks/useToggle'
import LogItem from './components/LogItem'
import { checkFirst } from './utils'
import type { log, logs } from './types/log'

const History = () => {
  const [status, toggle] = useToggle()
  const logs = useLogsContext()
  const [topList, setTopList] = useState<logs>([])
  const listRef = useRef<FlatList<log> | null>(null)
  const shouldShowTime = useMemo(() => checkFirst<string>(), [])

  useEffect(() => {
    readTopLogFile().then((data: logs) => {
      setTopList(data)
    })
  }, [])

  useEffect(() => {
    if (!listRef.current) {
      return
    }

    listRef.current.scrollToEnd({ animated: true })
  }, [logs])

  const renderItem: RenderItem = ({ item, index, activeItem }) => {
    const Component = LogItem(item)
    const showTime = shouldShowTime(parseTime(item.timeStamp, 0))

    return (
      <>
        {showTime && (
          <Text style={styles.time}>{parseTime(item.timeStamp, 2)}</Text>
        )}
        <Component log={item} index={index} activeItem={activeItem} />
      </>
    )
  }

  return (
    <View style={styles.main}>
      <View style={styles.buttonGroup}>
        <Button
          title="top"
          onPress={() =>
            listRef.current &&
            listRef.current.scrollToIndex({ index: 0, animated: true })
          }
        />
        <Button
          title="bottom"
          onPress={() =>
            listRef.current && listRef.current.scrollToEnd({ animated: true })
          }
        />
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={status ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggle}
          value={status}
        />
      </View>
      {status ? (
        <LogList
          list={topList}
          permissions={[operationType.copy]}
          renderItem={renderItem}
        />
      ) : (
        <LogList
          ref={listRef}
          list={logs}
          permissions={[operationType.copy, operationType.top]}
          renderItem={renderItem}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 20,
    backgroundColor: 'gainsboro'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
    marginBottom: 15
  },
  time: {
    marginBottom: 10,
    textAlign: 'center'
  }
})

const HistoryScreen = () => (
  <NameProvider>
    <LogsProvider>
      <History />
    </LogsProvider>
  </NameProvider>
)

HistoryScreen.options = {
  topBar: {
    title: {
      text: '历史记录'
    }
  }
}

export default HistoryScreen
