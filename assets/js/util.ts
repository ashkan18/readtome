export const isUrl = link => {
  try { return Boolean(new URL(link)); }
  catch(e){ return false; }
}

export const isISBN = isbn => {
  const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
  return isbnRegex.test(isbn)
}
