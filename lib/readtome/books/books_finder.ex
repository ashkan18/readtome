defmodule Readtome.BooksFinder do
  alias Readtome.Books.Book

  def by_isbn(isbn) do
    case google_books(isbn) do
      {:found, book} -> {:found, book}
      _ ->
        case isbn_db(isbn) do
          {:found, book} -> {:found, %Book{isbn: isbn}}
          _ -> {:not_found}
        end
    end
  end

  defp google_books(isbn) do
    case Readtome.GoogleBook.get("books/v1/volumes", query: %{q: "#{isbn}+isbn", key: Application.fetch_env!(:readtome, :googlebooks_api).key }) do
      %HTTPotion.Response{status_code: 200, body: body} ->
        first_guess = List.first(body["items"])
        {:found, %{
          title: first_guess["volumeInfo"]["title"],
          authors: first_guess["volumeInfo"]["authors"],
          genres: first_guess["volumeInfo"]["categories"],
          image_url: first_guess["volumeInfo"]["imageLinks"]["thumbnail"],
          description: first_guess["volumeInfo"]["description"]
        }}
      _ ->
        {:not_found}
    end
  end

  defp isbn_db(isbn) do
    {:found, 2}
  end
end