import type { Address } from "../../types/address"
import AddressCard from "./AddressCard"

type Props = {
  addresses: Address[]
  busyId?: string
  onEdit: (address: Address) => void
  onDelete: (address: Address) => void
  onDefault: (address: Address) => void
}

export default function AddressList({ addresses, busyId, onEdit, onDelete, onDefault }: Props) {
  if (addresses.length === 0) return <div className="panel" role="status"><h2>No saved addresses</h2><p>Add an address to make checkout faster later.</p></div>
  return <div className="address-list">{addresses.map((address) => <AddressCard key={address.id} address={address} busy={busyId === address.id} onEdit={() => onEdit(address)} onDelete={() => onDelete(address)} onDefault={() => onDefault(address)} />)}</div>
}
