defmodule ReadtomeWeb.BookController do
  use ReadtomeWeb, :controller

  alias Readtome.{Books, Books.Book, BooksFinder}

  action_fallback(ReadtomeWeb.FallbackController)

  def index(conn, _params) do
    books = Books.list_books()
    render(conn, "index.json", books: books)
  end

  def create(conn, %{"book" => book_params}) do
    with {:ok, %Book{} = book} <- Books.create_book(book_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", book_path(conn, :show, book))
      |> render("show.json", book: book)
    end
  end

  def find_in_the_wild(conn, %{"isbn" => isbn}) do
    case Books.by_isbn(isbn) do
      nil ->
        with {:found, founded_book} <- BooksFinder.by_isbn(isbn),
             {:ok, stored_book} <- Books.copy_external(founded_book) do
          Task.async(fn -> Books.populate_with_external(stored_book, founded_book) end)
          render(conn, "found.json", book: stored_book, external: founded_book)
        else
          _ ->
            conn
            |> put_status(:not_found)
            |> render(ReadtomeWeb.ErrorView, :"404")
        end

      book ->
        render(conn, "found.json", book: book, external: nil)
    end
  end

  def show(conn, %{"id" => id}) do
    book = Books.get_book!(id)
    render(conn, "show.json", book: book)
  end

  def update(conn, %{"id" => id, "book" => book_params}) do
    book = Books.get_book!(id)

    with {:ok, %Book{} = book} <- Books.update_book(book, book_params) do
      render(conn, "show.json", book: book)
    end
  end

  def delete(conn, %{"id" => id}) do
    book = Books.get_book!(id)

    with {:ok, %Book{}} <- Books.delete_book(book) do
      send_resp(conn, :no_content, "")
    end
  end
end
