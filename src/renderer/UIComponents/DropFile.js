//@flow

import React, { createRef, Component, type ElementRef } from 'react'

type Props = {
  children?: ?any,
  inputTestID?: ?string,
  accept?: Array<string>,
  multiple?: boolean,
  noClick?: boolean,
  className?: string,
  onDragClassName?: string,
  onDrop: (files: Array<File>) => any,
}

type State = {
  onDrag?: boolean,
}

export default class DropFile extends Component<Props, State> {
  state = {}

  // $FlowFixMe: React Ref
  fileInput: ElementRef<'input'> = createRef()

  // HANDLERS

  onDragOut = () => {
    this.setState({ onDrag: false })
  }

  onDragOver = (event: SyntheticDragEvent<HTMLHeadingElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'copy'
    this.setState({ onDrag: true })
  }

  onDrop = (event: SyntheticDragEvent<HTMLHeadingElement>) => {
    event.preventDefault()
    event.stopPropagation()

    let files = [...event.dataTransfer.files]

    const { accept } = this.props
    if (accept && accept.length) {
      files = files.filter(file => accept.includes(file.type))
    }

    this.props.onDrop && this.props.onDrop(files)
    this.setState({ onDrag: false })
  }

  onPress = () => {
    this.fileInput.current.click()
  }

  onFileInputChange = () => {
    const files = [...this.fileInput.current.files]
    this.props.onDrop && this.props.onDrop(files)
  }

  // RENDER

  render() {
    const className = `${this.props.className || ''} ${
      this.state.onDrag ? this.props.onDragClassName || '' : ''
    }`

    return (
      <>
        <div
          className={className}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragOut}
          onClick={!this.props.noClick ? this.onPress : null}>
          {this.props.children}
        </div>
        <input
          multiple={this.props.multiple}
          id={this.props.inputTestID}
          onChange={this.onFileInputChange}
          ref={this.fileInput}
          type="file"
          accept={
            this.props.accept && this.props.accept.length
              ? this.props.accept.join(',')
              : null
          }
          hidden
        />
      </>
    )
  }
}
