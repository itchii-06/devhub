import React, { useCallback, useRef } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { getTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import {
  ThemedActivityIndicator,
  ThemedActivityIndicatorProps,
} from '../themed/ThemedActivityIndicator'
import { ThemedText } from '../themed/ThemedText'
import {
  ThemedTouchableHighlight,
  ThemedTouchableHighlightProps,
} from '../themed/ThemedTouchableHighlight'
import { ThemedView } from '../themed/ThemedView'

export interface ButtonProps extends ThemedTouchableHighlightProps {
  children: React.ReactNode
  contentContainerStyle?: ViewProps['style']
  loading?: boolean
  loadingIndicatorStyle?: ThemedActivityIndicatorProps['style']
  round?: boolean
  size?: number
  type?: 'primary' | 'neutral' | 'danger'
}

export const defaultButtonSize = 40

export function Button(props: ButtonProps) {
  const {
    children,
    contentContainerStyle,
    loading,
    loadingIndicatorStyle,
    round = true,
    size = defaultButtonSize,
    style,
    type = 'neutral',
    ...otherProps
  } = props

  const containerViewRef = useRef<View>(null)
  const innerTouchableRef = useRef<ThemedTouchableHighlight>(null)
  const textRef = useRef<ThemedText>(null)

  const {
    backgroundThemeColor,
    foregroundThemeColor,
    backgroundHoverThemeColor,
    foregroundHoverThemeColor,
  } = getButtonColors(type)

  useHover(
    containerViewRef,
    useCallback(
      isHovered => {
        const theme = getTheme()

        if (innerTouchableRef.current) {
          innerTouchableRef.current.setNativeProps({
            style: {
              backgroundColor: isHovered
                ? backgroundHoverThemeColor
                  ? getThemeColorOrItself(theme, backgroundHoverThemeColor, {
                      enableCSSVariable: true,
                    })
                  : theme.isDark
                  ? theme.backgroundColorTransparent10
                  : theme.foregroundColorTransparent10
                : 'transparent',
            },
          })
        }

        if (textRef.current) {
          textRef.current.setNativeProps({
            style: {
              color:
                isHovered && foregroundHoverThemeColor
                  ? getThemeColorOrItself(theme, foregroundHoverThemeColor, {
                      enableCSSVariable: true,
                    })
                  : getThemeColorOrItself(
                      theme,
                      foregroundThemeColor || 'foregroundColor',
                      {
                        enableCSSVariable: true,
                      },
                    ),
            },
          })
        }
      },
      [
        backgroundThemeColor,
        foregroundThemeColor,
        backgroundHoverThemeColor,
        foregroundHoverThemeColor,
      ],
    ),
  )

  return (
    <ThemedView
      ref={containerViewRef}
      backgroundColor={backgroundThemeColor}
      style={[
        styles.button,
        { height: size },
        round && { borderRadius: size / 2 },
        style,
      ]}
    >
      <>
        <ThemedTouchableHighlight
          ref={innerTouchableRef}
          backgroundColor={undefined}
          underlayColor={backgroundHoverThemeColor}
          {...otherProps}
          style={[
            sharedStyles.fullWidth,
            sharedStyles.fullHeight,
            round && { borderRadius: size / 2 },
            loading && sharedStyles.opacity0,
          ]}
        >
          <View
            style={[
              sharedStyles.center,
              sharedStyles.fullWidth,
              sharedStyles.fullHeight,
              sharedStyles.paddingHorizontal,
              round && { borderRadius: size / 2 },
              contentContainerStyle,
            ]}
          >
            {typeof children === 'string' ? (
              <ThemedText
                ref={textRef}
                color={foregroundThemeColor}
                style={[
                  styles.text,
                  Platform.OS === 'web' && { lineHeight: size },
                ]}
              >
                {children}
              </ThemedText>
            ) : (
              children
            )}
          </View>
        </ThemedTouchableHighlight>

        {!!loading && (
          <View
            style={[StyleSheet.absoluteFill, sharedStyles.center]}
            pointerEvents="none"
          >
            <ThemedActivityIndicator
              color={foregroundThemeColor}
              size="small"
              style={loadingIndicatorStyle}
            />
          </View>
        )}
      </>
    </ThemedView>
  )
}

export function getButtonColors(
  type?: ButtonProps['type'],
): {
  backgroundThemeColor: keyof ThemeColors
  foregroundThemeColor: keyof ThemeColors
  backgroundHoverThemeColor: keyof ThemeColors
  foregroundHoverThemeColor: keyof ThemeColors
} {
  switch (type) {
    case 'danger':
      return {
        backgroundThemeColor: 'backgroundColorLess1',
        foregroundThemeColor: 'foregroundColor',
        backgroundHoverThemeColor: 'red',
        foregroundHoverThemeColor: 'white',
      }

    case 'primary':
      return {
        backgroundThemeColor: 'primaryBackgroundColor',
        foregroundThemeColor: 'primaryForegroundColor',
        backgroundHoverThemeColor: 'primaryBackgroundColor',
        foregroundHoverThemeColor: 'primaryForegroundColor',
      }

    default:
      return {
        backgroundThemeColor: 'backgroundColorLess1',
        foregroundThemeColor: 'foregroundColor',
        backgroundHoverThemeColor: 'backgroundColorLess2',
        foregroundHoverThemeColor: 'foregroundColor',
      }
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    overflow: 'hidden',
  },

  text: {
    fontWeight: '500',
  },
})
