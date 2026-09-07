import { useLocation, useParams } from "react-router-dom";
import ProductListingPage from "./ProductListingPage";

export default function ListingPage() {
  const loc = useLocation();
  const { categoryId } = useParams();
  const routeCat = loc.pathname.split("/")[1];
  return <ProductListingPage category={categoryId ?? routeCat} />;
}
