// @flow

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
  type AbstractComponent,
  type Node,
} from 'react'

import ToastMessage from '../UIComponents/ToastMessage'

export type ToastContextValue = {
  showToast: (message: string, timeout?: number) => void,
}

export const ToastContext = createContext<ToastContextValue>({})

export const useToast = () => {
  return useContext(ToastContext).showToast
}

export const withToast = <Config: ToastContextValue, Instance>(
  WrappedComponent: AbstractComponent<Config, Instance>,
): AbstractComponent<$Diff<Config, ToastContextValue>, Instance> => {
  const WithToastComponent = (props, ref) => (
    <ToastContext.Consumer>
      {(toastProps: ToastContextValue) => (
        <WrappedComponent {...props} {...toastProps} ref={ref} />
      )}
    </ToastContext.Consumer>
  )

  const name =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithToastComponent.displayName = `WithToast(${name})`

  return forwardRef(WithToastComponent)
}

type Props = {
  children: Node,
}

export function ToastProvider({ children }: Props) {
  const timer = useRef(null)
  const [message, setMessage] = useState<string>('')

  const clearTimer = () => {
    if (timer.current != null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  const showToast = useCallback((msg: string, timeout?: number = 3000) => {
    clearTimer()

    timer.current = setTimeout(() => {
      clearTimer()
      setMessage('')
    }, timeout)

    setMessage(msg)
  }, [])

  return (
    <>
      <ToastContext.Provider value={{ showToast }}>
        {children}
      </ToastContext.Provider>
      <ToastMessage message={message.length ? message : undefined} />
    </>
  )
}
