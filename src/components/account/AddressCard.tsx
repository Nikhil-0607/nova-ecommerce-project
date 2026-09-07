import type { Address } from "../../types/address"

type Props = {
  address: Address
  busy: boolean
  onEdit: () => void
  onDelete: () => void
  onDefault: () => void
}

export default function AddressCard({ address, busy, onEdit, onDelete, onDefault }: Props) {
  return (
    <article className="address-card">
      <div className="address-card-head">
        <div><h2>{address.addressType}</h2>{address.isDefault && <span className="address-default">DEFAULT ADDRESS</span>}</div>
        <strong>{address.fullName}</strong>
      </div>
      <address>
        {address.addressLine1}<br />{address.addressLine2 && <>{address.addressLine2}<br /></>}{address.city}, {address.state} {address.postalCode}<br />{address.country}<br />{address.phone && <>Phone: {address.phone}</>}
      </address>
      <div className="address-actions">
        <button className="btn secondary" type="button" onClick={onEdit} disabled={busy}>EDIT</button>
        <button className="btn secondary" type="button" onClick={onDelete} disabled={busy}>DELETE</button>
        {!address.isDefault && <button className="btn" type="button" onClick={onDefault} disabled={busy}>SET AS DEFAULT</button>}
      </div>
    </article>
  )
}
