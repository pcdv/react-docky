import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'
import 'react-docky/assets/index.css'
import 'react-docky/assets/skin.css'
import 'react-docky/assets/react-splitpane.css'

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
