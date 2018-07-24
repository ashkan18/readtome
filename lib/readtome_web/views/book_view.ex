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
      title: book.title,
      isbn: book.isbn,
      small_cover_url: book.small_cover_url,
      medium_cover_url: book.medium_cover_url,
      large_cover_url: book.large_cover_url,
      authors: render_many(book.authors, ReadtomeWeb.AuthorView, "author.json")}
  end

  def render("found.json", %{book: founded_book, external: external}) do
    if external === true do
      %{
        external: true,
        data: %{
          title: founded_book.title,
          isbn: founded_book.isbn,
          authors: founded_book.authors,
          tags: founded_book.tags,
          cover_url: founded_book.cover_url,
          description: founded_book.description
        }
      }
    else
      %{
        external: false,
        data: render("book.json", book: founded_book)
      }
    end
  end
end
