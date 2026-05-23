import React, { useEffect, useState } from "react";
import "./Search.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useFetchData, { getSearchProducts } from "../../services/api";
import Loader from "../../components/Loader";
import ProductItem from "../../components/ProductItem/ProductItem";
import Pagination from "../../components/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchTerm") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState(`&search=${searchQuery}`);
  const [itemsPerPage] = useState(6);

  const { data, isLoading, error } = useFetchData(
    getSearchProducts,
    currentPage,
    itemsPerPage,
    query
  );

  const totalItems = data ? data.total : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  useEffect(() => {
    setQuery(`&searchTerm=${searchQuery}`);
    setCurrentPage(1);
  }, [searchQuery]);

  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <>
      <Header />
      <div className="searchPageWrapper">
        <div className="searchTop">
          <h4>Rezultate e kerkimit: {totalItems}</h4>
          {totalItems ? (
            <h2>{searchQuery}</h2>
          ) : (
            <h2>Produkti i kerkuar nuk gjendet!</h2>
          )}
        </div>

        <div className="searchProducts">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="searchProductsList">
                {data?.data?.map((product: any) => (
                  <ProductItem key={product.id} productData={product} />
                ))}
              </div>
              {totalItems ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={paginate}
                />
              ) : (
                <>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
