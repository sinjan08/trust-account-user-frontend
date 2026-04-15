import { Link } from 'react-router-dom';


const PaginationControl = ({ currentPage, totalPages, pageSize, totalItems, onPageChange }) => {
  const totalPageOption = Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = totalPageOption.length > 0 ? totalPageOption : [1]


  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="dsbrd-pagination">
      <ul>
        <li onClick={() => onPageChange(currentPage - 1)} className='m-1'>
          <Link to="#" disabled={currentPage === 1}>
            <img src="images/left-chevron.svg" alt="Previous" />
          </Link>
        </li>
        {pages.map((page) => (
          <li key={page} className={`m-2 ${page === currentPage ? 'active' : ''}`} onClick={() => onPageChange(page)}>
            <Link to="#" className='pagination-link' style={page === currentPage ? { color: 'white' } : { color: '#3182CE' }} >
              {page}
            </Link>
          </li>
        ))}
        <li onClick={() => onPageChange(currentPage + 1)} className='m-2'>
          <Link to="#" disabled={currentPage === totalPages}>
            <img src="images/left-chevron.svg" alt="Next" style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </li>
      </ul>
      <p className='text-black'>Showing {totalItems === 0 ? 0 : `${start}–${end}`} of {totalItems} results</p>
    </div>
  )
}

export default PaginationControl