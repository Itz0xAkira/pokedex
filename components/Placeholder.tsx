/**
 * Placeholder Component
 * 
 * This is a placeholder component until we migrate the full UI from the original project.
 */

interface PlaceholderProps {
  title: string
  description?: string
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="p-8 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
      <p className="text-sm text-gray-500 mt-4">
        test
      </p>
    </div>
  )
}

