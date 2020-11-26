/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {Dialog} from './lib'

// could also use this snazzy function for call all instead of manually calling onClick
// const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))
// and in clone element do
// onClick: callAll(() => setIsOpen(false), child.props.onClick)

const ModalContext = React.createContext()

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

function ModalDismissButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: () => {
        child.props.onClick && child.props.onClick(); // call an onClick function if it has been passed
        setIsOpen(false); //also close the modal
    },
  })
}

function ModalOpenButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: () => {
        child.props.onClick && child.props.onClick(); // call an onClick function if it has been passed
        setIsOpen(true); //also open the modal
    },
  })
}

function ModalContents(props) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
