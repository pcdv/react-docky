import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-docky/assets/index.css'
import 'react-docky/assets/react-splitpane.css'
import 'react-docky/assets/skin.css'
import App from './App'
import App2 from './App2'
import './App.css'
import Custom from './Custom'

const EXAMPLES = {
  uncontrolled: { title: 'Uncontrolled', component: App },
  controlled: { title: 'Controlled, with undo', component: App2 },
  custom: { title: 'Custom look and feel', component: Custom },
}

type Name = keyof typeof EXAMPLES

const current = (): Name => {
  const name = location.hash.slice(1)
  return name in EXAMPLES ? (name as Name) : 'uncontrolled'
}

function Examples() {
  const [name, setName] = useState(current)

  useEffect(() => {
    const onHashChange = () => setName(current())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const Example = EXAMPLES[name].component
  return (
    <>
      <nav id="examples">
        {Object.entries(EXAMPLES).map(([key, { title }]) => (
          <a key={key} href={`#${key}`} className={key === name ? 'active' : ''}>
            {title}
          </a>
        ))}
      </nav>
      <main id="example">
        <Example key={name} />
      </main>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Examples />
  </StrictMode>
)
