import { useStore } from '../../context/StoreContext'
export default function Toast(){ const {toasts}=useStore(); return <div className="toast-stack">{toasts.map(t=><div className="toast" key={t.id}>{t.message}</div>)}</div> }
