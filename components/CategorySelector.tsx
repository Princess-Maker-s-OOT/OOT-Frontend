import React, { useState, useEffect } from "react";

type CategoryNode = {
  id: number;
  name: string;
  children?: CategoryNode[];
};

type Props = {
  categories: CategoryNode[];
  onSelect: (categoryId: number) => void;
};

export default function CategorySelector({ categories, onSelect }: Props) {
  const [rootId, setRootId] = useState<number | null>(null);
  const [midId, setMidId] = useState<number | null>(null);
  const [leafId, setLeafId] = useState<number | null>(null);

  const rootOptions = categories;
  const midOptions = rootId
    ? categories.find((c) => c.id === rootId)?.children ?? []
    : [];
  const leafOptions = midId
    ? midOptions.find((c) => c.id === midId)?.children ?? []
    : [];

  useEffect(() => {
    if (leafId) onSelect(leafId);
  }, [leafId]);

  return (
    <div className="space-y-2">
      <select className="w-full border rounded px-3 py-2" value={rootId ?? ""} onChange={(e) => {
        const id = Number(e.target.value);
        setRootId(id);
        setMidId(null);
        setLeafId(null);
      }}>
        <option value="">대분류 선택</option>
        {rootOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      {midOptions.length > 0 && (
        <select className="w-full border rounded px-3 py-2" value={midId ?? ""} onChange={(e) => {
          const id = Number(e.target.value);
          setMidId(id);
          setLeafId(null);
        }}>
          <option value="">중분류 선택</option>
          {midOptions.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      )}

      {leafOptions.length > 0 && (
        <select className="w-full border rounded px-3 py-2" value={leafId ?? ""} onChange={(e) => setLeafId(Number(e.target.value))}>
          <option value="">소분류 선택</option>
          {leafOptions.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      )}
    </div>
  );
}