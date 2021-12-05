import React from 'react'
import { FooterProps } from '.'
import { Tab } from './Tab'

export const Footer = ({ tabs, active, onActivate, dragTabsRef }: FooterProps) => {
  if (!tabs.tabs.length) return null

  return (
    <div className="rd-frame-footer" ref={dragTabsRef}>
      {tabs.tabs.map((v, i) => (
        <Tab
          key={v.id}
          view={v}
          active={i === active}
          onActivate={() => onActivate(i)}
          onClose={() => {}}
        />
      ))}
    </div>
  )
}
