import { useEffect, useMemo } from 'react'
import { Text, StyleSheet } from 'react-native'
import { parseTime } from 'srcNew/utils/date'

interface FadeOutTimeProps {
  show: boolean
  resetShow: () => void
  time: number
}

const FadeOutTime = ({ show, resetShow, time }: FadeOutTimeProps) => {
  const formatTime = useMemo(() => {
    return parseTime(time, 2)
  }, [time])

  useEffect(() => {
    if (!show) {
      return
    }

    const timer = setTimeout(() => {
      resetShow()
    }, 4000)

    return () => {
      clearTimeout(timer)
    }
  }, [show, resetShow])

  if (!show) {
    return null
  }
  return <Text style={styles.time}>{formatTime}</Text>
}

const styles = StyleSheet.create({
  time: {}
})

export default FadeOutTime
