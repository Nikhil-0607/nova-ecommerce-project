import { useEffect, useState } from "react"
import AccountLayout from "../components/account/AccountLayout"
import AddressForm, { type AddressFormErrors, type AddressFormValues } from "../components/account/AddressForm"
import AddressList from "../components/account/AddressList"
import SEO from "../components/seo/SEO"
import Skeleton from "../components/common/Skeleton"
import { useStore } from "../context/StoreContext"
import { analytics } from "../services/analyticsService"
import { customerService } from "../services/customerService"
import type { Address } from "../types/address"
import type { ApiError } from "../types/api"

const emptyAddress = (): AddressFormValues => ({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "India", addressType: "HOME" })
const postalPattern = /^[A-Za-z0-9][A-Za-z0-9 -]{2,11}$/
const phonePattern = /^[+0-9() .-]{7,20}$/

export default function AccountAddressesPage() {
  const { notify } = useStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Address>()
  const [values, setValues] = useState<AddressFormValues>(emptyAddress())
  const [errors, setErrors] = useState<AddressFormErrors>({})
  const [busyId, setBusyId] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setAddresses(await customerService.getAddresses()); setError("") }
    catch { setError("We couldn't load your addresses. Please try again.") }
    finally { setLoading(false) }
  }

  useEffect(() => { analytics.track("ADDRESS_LIST_VIEWED", {}); void load() }, [])

  const openAdd = () => { setEditing(undefined); setValues(emptyAddress()); setErrors({}); setFormOpen(true) }
  const openEdit = (address: Address) => {
    setEditing(address)
    setValues({ fullName: address.fullName, phone: address.phone, addressLine1: address.addressLine1, addressLine2: address.addressLine2 ?? "", city: address.city, state: address.state, postalCode: address.postalCode, country: address.country, addressType: address.addressType })
    setErrors({})
    setFormOpen(true)
  }
  const validate = (): boolean => {
    const next: AddressFormErrors = {}
    for (const field of ["fullName", "addressLine1", "city", "state", "country"] as const) if (!values[field].trim()) next[field] = "This field is required."
    if (!values.postalCode.trim()) next.postalCode = "Enter a postal code."
    else if (!postalPattern.test(values.postalCode.trim())) next.postalCode = "Enter a valid postal code."
    if (values.phone.trim() && !phonePattern.test(values.phone.trim())) next.phone = "Enter a valid phone number."
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const submit = async () => {
    if (!validate()) return
    setSubmitting(true)
    const payload = { ...values, fullName: values.fullName.trim(), phone: values.phone.trim(), addressLine1: values.addressLine1.trim(), addressLine2: values.addressLine2?.trim(), city: values.city.trim(), state: values.state.trim(), postalCode: values.postalCode.trim(), country: values.country.trim() }
    try {
      if (editing) {
        analytics.track("ADDRESS_EDIT_STARTED", { addressId: editing.id })
        const updated = await customerService.updateAddress(editing.id, payload)
        analytics.track("ADDRESS_EDIT_SUCCESS", { addressId: updated.id })
        notify("Address updated successfully")
      } else {
        analytics.track("ADDRESS_ADD_STARTED", {})
        const added = await customerService.addAddress(payload)
        analytics.track("ADDRESS_ADD_SUCCESS", { addressId: added.id })
        notify("Address added successfully")
      }
      setFormOpen(false)
      await load()
    } catch (error) {
      const code = (error as Partial<ApiError>).code ?? "SERVER_ERROR"
      if (editing) analytics.track("ADDRESS_EDIT_FAILED", { addressId: editing.id, code })
      else analytics.track("ADDRESS_ADD_FAILED", { code })
      notify("We couldn't save that address. Please try again.")
    } finally { setSubmitting(false) }
  }
  const remove = async (address: Address) => {
    if (!window.confirm("Delete this saved address?")) return
    setBusyId(address.id)
    analytics.track("ADDRESS_DELETE_STARTED", { addressId: address.id })
    try { await customerService.deleteAddress(address.id); analytics.track("ADDRESS_DELETE_SUCCESS", { addressId: address.id }); notify("Address deleted successfully"); await load() }
    catch (error) { analytics.track("ADDRESS_DELETE_FAILED", { addressId: address.id, code: (error as Partial<ApiError>).code ?? "SERVER_ERROR" }); notify("We couldn't delete that address. Please try again.") }
    finally { setBusyId(undefined) }
  }
  const setDefault = async (address: Address) => {
    setBusyId(address.id)
    try { await customerService.setDefaultAddress(address.id); analytics.track("ADDRESS_DEFAULT_SET", { addressId: address.id }); notify("Default address updated"); await load() }
    catch { notify("We couldn't update the default address. Please try again.") }
    finally { setBusyId(undefined) }
  }

  return <><SEO title="Addresses | NOVA" description="Manage your NOVA delivery addresses." robots="noindex,nofollow" /><section className="section container"><AccountLayout><section className="account-section" aria-labelledby="addresses-title"><div className="account-section-head"><div><span className="eyebrow">ACCOUNT</span><h1 id="addresses-title">Saved addresses</h1><p className="account-intro">Manage delivery addresses for your NOVA account.</p></div><button className="btn" type="button" onClick={openAdd}>ADD ADDRESS</button></div>{loading && <div className="panel account-loading" aria-live="polite"><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line" /><p>Loading your addresses...</p></div>}{!loading && error && <div className="panel auth-error" role="alert"><p>{error}</p><button className="btn secondary" type="button" onClick={() => void load()}>TRY AGAIN</button></div>}{!loading && !error && <><AddressList addresses={addresses} busyId={busyId} onEdit={openEdit} onDelete={(address) => void remove(address)} onDefault={(address) => void setDefault(address)} />{formOpen && <div className="panel address-editor"><h2>{editing ? "Edit address" : "Add address"}</h2><AddressForm values={values} errors={errors} submitting={submitting} onChange={setValues} onSubmit={() => void submit()} onCancel={() => setFormOpen(false)} /></div>}</>}</section></AccountLayout></section></>
}
