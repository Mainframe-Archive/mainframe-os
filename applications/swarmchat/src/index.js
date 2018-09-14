import React from 'react'
import { render } from 'react-dom'
import Modal from 'react-modal'

import './index.css'
import SwarmChat from './components/SwarmChat'

const el = document.getElementById('root')

Modal.setAppElement(el)
render(<SwarmChat />, el)
