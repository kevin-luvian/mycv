import styles from "./styles.module.scss";
import { concat } from "../../util/utils";
import { useCallback, useEffect, useState } from "react";
import { constraint, pad } from "../../util/utils";

const CHUNK_SIZE = 5;
export const BasicPagination = ({ className, onChange, pageSize }) => {
    const [pageNums, setPageNums] = useState([]);
    const [activePage, setActivePage] = useState(0);
    const maxChunkSize = Math.ceil(pageSize / CHUNK_SIZE) - 1;

    const findChunk = useCallback(pageNum => Math.max(Math.floor(pageNum / CHUNK_SIZE), 0), []);
    const firstChunkPage = useCallback(chunkNum => chunkNum * CHUNK_SIZE, []);
    const lastChunkPage = useCallback(chunkNum =>
        Math.min(firstChunkPage(chunkNum) + CHUNK_SIZE, pageSize), [firstChunkPage, pageSize]);

    const slideChunk = displacement => {
        const curChunk = findChunk(activePage) + displacement;
        changePage(firstChunkPage(curChunk));
    }

    const renderChunk = useCallback(pageNum => {
        const newPageNums = [];
        const curChunk = findChunk(pageNum);
        const firstPage = firstChunkPage(curChunk);
        const lastPage = lastChunkPage(curChunk);
        for (let page = firstPage; page < lastPage; page++) {
            newPageNums.push(page);
        }
        setPageNums(newPageNums);
    }, [findChunk, firstChunkPage, lastChunkPage])

    const changePage = useCallback(pageNum =>
        setActivePage(constraint(pageNum, 0, pageSize - 1)), [pageSize]);

    useEffect(() => changePage(0), [changePage]);
    useEffect(() => {
        renderChunk(activePage);
        onChange?.(activePage);
    }, [activePage, renderChunk, onChange]);

    return (
        <div className={concat(className, styles.basicPagination)}>
            {findChunk(activePage) > 0 &&
                <div onClick={() => slideChunk(-1)} className={styles.pagenum}>{"<<"}</div>
            }
            <div className={styles.pagenum} onClick={() => changePage(activePage - 1)}>{"<"}</div>
            {pageNums.map((pageNum, index) =>
                <div className={concat(styles.pagenum, pageNum === activePage && styles.active)}
                    key={index} onClick={() => changePage(pageNum)}>{pad(pageNum + 1, 2)}</div>
            )}
            <div className={styles.pagenum} onClick={() => changePage(activePage + 1)}>{">"}</div>
            {findChunk(activePage) < maxChunkSize &&
                <div onClick={() => slideChunk(1)} className={styles.pagenum}>{">>"}</div>
            }
        </div>
    )
}

export const IndexedPagination = ({ className, onChange, itemSize, perPage }) => {
    const handleChange = useCallback(page =>
        onChange?.(page * perPage, (page * perPage) + perPage), [onChange, perPage]);

    return <BasicPagination
        className={className}
        onChange={handleChange}
        pageSize={Math.ceil(itemSize / perPage)} />
}