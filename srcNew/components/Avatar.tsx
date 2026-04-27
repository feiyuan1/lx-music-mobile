import {
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  Pressable,
  StyleSheet
} from 'react-native'
import getManager, { keysMap } from 'srcNew/utils/manager'

interface AvatarProps {
  src: ImageSourcePropType
  style: ImageStyle
}

const { dispatch } = getManager()

const Avatar = ({ src, style }: AvatarProps) => {
  const finalStyle = StyleSheet.flatten([style, styles.tinyLogo])
  const showImageModal = () => {
    dispatch(keysMap.imageFill, src)
  }

  return (
    <Pressable onPress={showImageModal}>
      <Image source={src} style={finalStyle} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 40,
    height: 40,
    borderRadius: 5
  }
})

export default Avatar
