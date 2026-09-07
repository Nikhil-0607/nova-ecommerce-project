import { useEffect, type ReactNode } from "react"

type DrawerProps = {
  open: boolean
  label: string
  onClose: () => void
  children: ReactNode
}

export default function Drawer({ open, label, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [onClose, open])

  if (!open) return null
  return (
    <div className="filter-drawer-backdrop" role="presentation" onClick={onClose}>
      <div className="filter-drawer" role="dialog" aria-modal="true" aria-label={label} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
