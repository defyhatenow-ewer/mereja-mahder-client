/**
 * Filters properties with empty values from an object
 * @param obj Object to be filtered
 * @returns Object without empty values such as null, '', or []
 */
const deleteEmptyProps = (
  obj: Record<string, string | null | string[] | undefined>,
) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key]?.length === 0) {
      delete obj[key];
    }
  }
  return obj;
};

export default deleteEmptyProps;
