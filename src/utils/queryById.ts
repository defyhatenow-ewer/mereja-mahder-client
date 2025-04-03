import * as qs from "qs-esm";

const queryById = (itemId: string) =>
  qs.stringify(
    {
      where: {
        id: {
          equals: itemId,
        },
      },
    },
    { addQueryPrefix: true }
  );

export default queryById;
