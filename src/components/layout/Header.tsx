import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const nav=['men','women','kids','home','beauty']
export default function Header(){
  const {cart,wishlist}=useStore(); const [q,setQ]=useState(''); const [open,setOpen]=useState(false); const navigate=useNavigate()
  const submit=(e:React.FormEvent)=>{e.preventDefault();navigate(`/search?q=${encodeURIComponent(q)}`);setOpen(false)}
  return <>
    <div className="announcement">FREE SHIPPING ON ORDERS ABOVE ₹999 <span>• EASY 14-DAY RETURNS</span></div>
    <header className="header"><div className="container header-inner">
      <button className="menu-btn" aria-label="Open menu" onClick={()=>setOpen(!open)}>☰</button>
      <Link to="/" className="logo">NOVA</Link>
      <nav className={open?'nav open':'nav'}>{nav.map(n=><NavLink key={n} to={`/${n}`} onClick={()=>setOpen(false)}>{n.toUpperCase()}</NavLink>)}<NavLink to="/brands">BRANDS</NavLink><NavLink to="/offers">OFFERS</NavLink></nav>
      <form className="search" onSubmit={submit}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products, brands and more..." aria-label="Search"/></form>
      <div className="actions"><Link to="/account">Profile</Link><Link to="/wishlist">♡ <b>{wishlist.length}</b></Link><Link to="/cart">Bag <b>{cart.length}</b></Link></div>
    </div></header>
  </>
}
