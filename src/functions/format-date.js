const formatDate = (date) => {
		const parseFormat = /\/Date\((\d*)\)\//
		return parseInt(parseFormat.exec(date)[1], 10)
}

export default formatDate
