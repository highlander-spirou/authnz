export const formSerialize = async (request) => {
	const formDataRaw = (await request.formData()) as FormData
	const formDataString = formDataRaw.get("formData") as string | null
	if (formDataString) {
		return JSON.parse(formDataString)
	} else {
		return null
	}
}
