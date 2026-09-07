import { Outlet } from 'react-router-dom'
import Header from './Header'; import Footer from './Footer'; import Toast from '../common/Toast'
export default function Layout(){return <><Header/><main><Outlet/></main><Footer/><Toast/><nav className="mobile-bottom"><a href="/">Home</a><a href="/men">Categories</a><a href="/wishlist">Wishlist</a><a href="/orders">Orders</a><a href="/account">Profile</a></nav></>}
