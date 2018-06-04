defmodule ReadtomeWeb.BookView do
  use ReadtomeWeb, :view
  alias ReadtomeWeb.BookView

  def render("index.json", %{books: books}) do
    %{data: render_many(books, BookView, "book.json")}
  end

  def render("show.json", %{book: book}) do
    %{data: render_one(book, BookView, "book.json")}
  end

  def render("book.json", %{book: book}) do
    %{id: book.id,
      name: book.name,
      isbn: book.isbn,
      small_cover_url: book.small_cover_url,
      medium_cover_url: book.medium_cover_url,
      large_cover_url: book.large_cover_url,
      condition: book.condition}
  end
end
