import React from "react";

type CategoryNode = {
  id: number;
  name: string;
  imageUrl?: string;
};

type Props = {
  categories: CategoryNode[];
  onClick: (categoryId: number) => void;
};

export default function CategoryGrid({ categories, onClick }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onClick(c.id)}
          className="bg-white border rounded shadow hover:shadow-md transition p-3 text-center"
        >
          {c.imageUrl && (
            <img src={c.imageUrl} alt={c.name} className="h-24 w-full object-cover rounded mb-2" />
          )}
          <span className="text-sm font-medium text-gray-700">{c.name}</span>
        </button>
      ))}
    </div>
  );
}