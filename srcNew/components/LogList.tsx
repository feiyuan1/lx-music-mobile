import { type FC, forwardRef, useCallback, useMemo, useState } from 'react'
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native'
import type {
  Current,
  log,
  logs,
  Permissions,
  UpdateList
} from 'srcNew/types/log'
import OperateProvider from 'srcNew/contexts/OperateContext'
import OperationModal from './OperationModal'
import LogItem from './LogItem'
import Text from '@/components/common/Text'
type ActiveItem = (index: number) => void
interface RenderItemProps {
  item: log
  index: number
  activeItem: ActiveItem
}
export type RenderItem = (props: RenderItemProps) => React.JSX.Element

interface LogListProps {
  list: logs
  permissions?: Permissions
  updateList?: UpdateList
  renderItem?: RenderItem
  defaultEmptyText?: string
  EmptyComponent?: FC
}

const LogList = forwardRef<FlatList<log>, LogListProps>(
  (
    {
      list,
      updateList = () => {},
      permissions,
      renderItem: innerRender,
      EmptyComponent,
      defaultEmptyText
    },
    ref
  ) => {
    const [current, setCurrent] = useState<Current>(null)
    const [visible, setVisible] = useState(false)
    const shouldShow = useMemo(() => {
      /**
       * 2. 没有选中的消息不可弹窗
       * 3. 如果允许的操作个数为 0 不可弹窗
       */
      return current && (!permissions || permissions.length > 0)
    }, [current, permissions])

    const activeItem: ActiveItem = (index) => {
      setCurrent({ data: list[index], index })
      setVisible(true)
    }

    const defaultInnerRender = useCallback<RenderItem>(
      ({ item, index, activeItem }) => {
        const Component = LogItem(item)

        return <Component log={item} index={index} activeItem={activeItem} />
      },
      []
    )

    const renderItem: ListRenderItem<log> = (data) => {
      const fn = innerRender ?? defaultInnerRender
      return fn({ ...data, activeItem })
    }

    const DefaultEmptyComponent = () => (
      <Text>{defaultEmptyText ?? '还没有内容哦'}</Text>
    )

    return (
      <OperateProvider value={{ current, updateLog: updateList }}>
        <View style={styles.list}>
          <FlatList
            ref={ref}
            data={list}
            renderItem={renderItem}
            ListEmptyComponent={EmptyComponent ?? DefaultEmptyComponent}
          />
          {shouldShow && (
            <OperationModal
              permissions={permissions}
              visible={visible}
              setVisible={setVisible}
            />
          )}
        </View>
      </OperateProvider>
    )
  }
)

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
})

export default LogList
