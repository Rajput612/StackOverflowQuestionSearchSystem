import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { JsonView } from "json-view-for-react";

import "../App.css";

const Pagination = ({ itemsPerPage, items, loading }) => {
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        if (items != null) {
            setCurrentItems(items.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(items.length / itemsPerPage));
        }
    }, [itemOffset, itemsPerPage, items]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    function Items({ currentItems }) {
        if (loading) {
            return <div className="mt-3">Loading...</div>;
        } else if (currentItems != null && currentItems.length > 0) {
            return (
                <div className="mt-3 d-flex align-items-center justify-content-between flex-wrap">
                    {currentItems.map((res) => (
                        <>
                            <JsonView obj={res} showLineNumbers />
                        </>
                    ))}
                </div>
            );
        } else {
            return <></>;
        }
    }

    return (
        <div>
            <Items currentItems={currentItems} />
            <div className="m-3 d-flex justify-content-center">
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </div>
        </div>
    );
};

export default Pagination;
