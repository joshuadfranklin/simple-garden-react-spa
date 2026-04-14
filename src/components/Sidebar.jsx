export default function Sidebar({ widthIn, lengthIn, onUpdate }) {
  return (
    <aside className="w-52 border-r">
      <input
        aria-label="Width"
        type="number"
        value={widthIn}
        onChange={e => onUpdate({ widthIn: Math.max(10, parseInt(e.target.value) || 10) })}
      />
      <input
        aria-label="Length"
        type="number"
        value={lengthIn}
        onChange={e => onUpdate({ lengthIn: Math.max(10, parseInt(e.target.value) || 10) })}
      />
    </aside>
  )
}
