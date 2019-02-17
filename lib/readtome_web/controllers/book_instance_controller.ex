defmodule ReadtomeWeb.BookInstanceController do
  use ReadtomeWeb, :controller

  alias Readtome.Books
  alias Readtome.Books.BookInstance

  action_fallback ReadtomeWeb.FallbackController

  def create(conn, %{"book_instance" => book_instance_params}) do
    with {:ok, %BookInstance{} = book_instance} <- Books.create_book_instance(book_instance_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", book_instance_path(conn, :show, book_instance))
      |> render("show.json", book_instance: book_instance)
    end
  end

  def show(conn, %{"id" => id}) do
    book_instance = Books.get_book_instance!(id)
    render(conn, "show.json", book_instance: book_instance)
  end

  def update(conn, %{"id" => id, "book_instance" => book_instance_params}) do
    book_instance = Books.get_book_instance!(id)

    with {:ok, %BookInstance{} = book_instance} <- Books.update_book_instance(book_instance, book_instance_params) do
      render(conn, "show.json", book_instance: book_instance)
    end
  end

  def delete(conn, %{"id" => id}) do
    book_instance = Books.get_book_instance!(id)
    with {:ok, %BookInstance{}} <- Books.delete_book_instance(book_instance) do
      send_resp(conn, :no_content, "")
    end
  end
end
