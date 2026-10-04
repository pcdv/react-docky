import { ComponentType, StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-docky/assets/index.css'
import 'react-docky/assets/splitter.css'
import 'react-docky/assets/skin.css'
import App from './App'
import App2 from './App2'
import './App.css'
import Custom from './Custom'
import Skins from './Skins'

const EXAMPLES = {
  skins: { title: 'Skins', component: Skins },
  uncontrolled: { title: 'Uncontrolled', component: App },
  controlled: { title: 'Controlled, with undo', component: App2 },
  custom: { title: 'Custom look and feel', component: Custom },
}

type Name = keyof typeof EXAMPLES

/** "#skins/win95" shows the "skins" example, with "win95" as its argument */
const current = (): { name: Name; arg?: string } => {
  const [name, arg] = location.hash.slice(1).split('/')
  return name in EXAMPLES ? { name: name as Name, arg } : { name: 'skins' }
}

function Examples() {
  const [{ name, arg }, setRoute] = useState(current)

  useEffect(() => {
    const onHashChange = () => setRoute(current())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const Example: ComponentType<{ arg?: string }> = EXAMPLES[name].component
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
        <Example key={name} arg={arg} />
      </main>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Examples />
  </StrictMode>
)
