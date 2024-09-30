const authKeys = {
  all: ["profiles"] as const,
  id: (id) => [...authKeys.all, id] as const,
  search: (q:string) => [...authKeys.all, "search", q] as const,
};

export default authKeys;