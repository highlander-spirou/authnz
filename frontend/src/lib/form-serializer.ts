export const formSerialize = async (request) => {
    const formData = await request.formData();
    return Object.fromEntries(formData);
  };