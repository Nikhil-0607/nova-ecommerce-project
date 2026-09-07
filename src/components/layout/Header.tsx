import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import SearchAutocomplete from '../search/SearchAutocomplete'

const nav=['men','women','kids','home','beauty']
export default function Header(){
  const {cart,wishlist}=useStore(); const [open,setOpen]=useState(false)
  return <>
    <div className="announcement">FREE SHIPPING ON ORDERS ABOVE ₹999 <span>• EASY 14-DAY RETURNS</span></div>
    <header className="header"><div className="container header-inner">
      <button className="menu-btn" aria-label="Open menu" onClick={()=>setOpen(!open)}>☰</button>
      <Link to="/" className="logo">NOVA</Link>
      <nav className={open?'nav open':'nav'}>{nav.map(n=><NavLink key={n} to={`/${n}`} onClick={()=>setOpen(false)}>{n.toUpperCase()}</NavLink>)}<NavLink to="/brands">BRANDS</NavLink><NavLink to="/offers">OFFERS</NavLink></nav>
      <div className="search"><SearchAutocomplete /></div>
      <div className="actions"><Link to="/account">Profile</Link><Link to="/wishlist">♡ <b>{wishlist.length}</b></Link><Link to="/cart">Bag <b>{cart.length}</b></Link></div>
    </div></header>
  </>
}
