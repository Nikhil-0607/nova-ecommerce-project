import { useEffect, useRef, useState } from "react"
import type { SizeChartRow } from "../../services/sizeChartService"

export default function SizeChart({ rows }: { rows: SizeChartRow[] }) {
  const [open, setOpen] = useState(false)
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    closeButton.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [open])

  return <>
    <button type="button" className="text-btn size-chart-trigger" onClick={() => setOpen(true)}>Size chart</button>
    {open && <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
      <div className="size-chart-modal" role="dialog" aria-modal="true" aria-labelledby="size-chart-title" onClick={(event) => event.stopPropagation()}>
        <button ref={closeButton} type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Close size chart">×</button>
        <h2 id="size-chart-title">Size chart</h2>
        <div className="size-chart-table-wrap"><table><thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr></thead><tbody>{rows.map((row) => <tr key={row.size}><td>{row.size}</td><td>{row.chest}</td><td>{row.waist}</td><td>{row.hip}</td></tr>)}</tbody></table></div>
      </div>
    </div>}
  </>
}
