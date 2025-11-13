"use client"

import React, { useState } from "react"

export type CategoryNode = {
  id: number
  name: string
  children?: CategoryNode[]
}

type Props = {
  categories: CategoryNode[]
  onSelect: (categoryId: number) => void
}

export default function CategorySidebar({ categories, onSelect }: Props) {
  const [expanded, setExpanded] = useState<number[]>([])

  function toggle(id: number) {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function renderTree(nodes: CategoryNode[]) {
    return (
      <ul className="space-y-1 pl-2">
        {nodes.map((node) => (
          <li key={node.id}>
            <button
              className="text-left w-full text-sm text-gray-700 hover:text-sky-600 transition-colors"
              onClick={() => {
                if (node.children?.length) toggle(node.id)
                else onSelect(node.id)
              }}
            >
              {node.name}
              {node.children?.length ? (
                <span className="ml-1 text-xs text-gray-400">
                  {expanded.includes(node.id) ? "▾" : "▸"}
                </span>
              ) : null}
            </button>
            {node.children && expanded.includes(node.id) && renderTree(node.children)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="h-full w-52 bg-sky-50 border-r px-4 py-6">
      <h2 className="text-base font-semibold text-sky-700 mb-4">카테고리</h2>
      {renderTree(categories)}
    </div>
  )
}