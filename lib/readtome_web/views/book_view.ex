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

  def render("found.json", %{book: book, external: external}) do
    %{
      book: render("book.json", book: founded_book),
      external: external_book(external)
    }
  end

  defp external_book(nil), do nil
  defp external_book(external) do
    %{
      title: external.title,
      isbn: external.isbn,
      authors: external.authors,
      tags: external.tags,
      cover_url: external.cover_url,
      description: external.description
    }
  end
end
