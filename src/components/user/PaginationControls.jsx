const PaginationControls = ({ currentPage, totalPages, pageSize, totalItems, onPageChange }) => {
	
	const handlePageChange = (pageNumber) => {
		if (pageNumber > 0 && pageNumber <= totalPages) {
			onPageChange(pageNumber); 
		}
	};

	return (
		<div className="dsbrd-pagination">
			<ul>
				<li
					onClick={() => handlePageChange(currentPage - 1)}
					className="prev"
				>
					<img src="images/left-chevron.svg" alt="Previous" />
				</li>
				{[...Array(totalPages).keys()].map((num) => (
					<li
						key={num + 1}
						onClick={() => handlePageChange(num + 1)}
						className={currentPage === num + 1 ? "active" : ""}
						style={{ color: 'black' }}
					>
						{num + 1}
					</li>
				))}
				<li
					onClick={() => handlePageChange(currentPage + 1)}
					className="next"
				>
					<img src="images/left-chevron.svg" alt="Next" style={{ transform: 'rotate(180deg)' }} />
				</li>
			</ul>
		</div>
	);
};

export default PaginationControls;
