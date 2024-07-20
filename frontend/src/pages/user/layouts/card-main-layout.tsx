const CardMainLayout = ({ children }) => {
	return (
		<>
			<div className="mt-5 md:mt-0 md:col-span-2">
				<div className="px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">
					{children}
				</div>
			</div>
		</>
	)
}

export default CardMainLayout
