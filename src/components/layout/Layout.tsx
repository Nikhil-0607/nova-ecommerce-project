import { Link, Outlet } from 'react-router-dom'
import Header from './Header'; import Footer from './Footer'; import Toast from '../common/Toast'
export default function Layout(){return <><Header/><main><Outlet/></main><Footer/><Toast/><nav className="mobile-bottom"><Link to="/">Home</Link><Link to="/men">Categories</Link><Link to="/wishlist">Wishlist</Link><Link to="/orders">Orders</Link><Link to="/account">Profile</Link></nav></>}
