const { default: axios } = require("axios");

export const findByISBN = (
  token: string | null,
  isbn: string
): Promise<any> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      data: {
        query: `
            query FindByIsbn($isbn: String) {
              findByIsbn(isbn: $isbn) {
                image
                title
                creatorNames
                tags
                type
                description
              }
            }
          `,
        variables: { isbn },
      },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const result = response.data.data.findByIsbn
        return resolve(
          {
            image: result.image,
            title: result.title,
            creatorNames: result.creatorNames,
            type: result.type,
            externalId: isbn,
            metadata: {
              tags: result.tags,
              description: result.description
            }
          });
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};
