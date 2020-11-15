defmodule Readtome.BooksFinder do
  def by_isbn(isbn) do
    case google_books(isbn) do
      {:found, book} -> {:found, book}
      _ -> {:not_found}
    end
  end

  defp google_books(isbn) do
    case Readtome.GoogleBook.get_book(isbn) do
      {:ok, book} ->
        {:found,
         %{
           isbn: isbn,
           title: book["volumeInfo"]["title"],
           authors: book["volumeInfo"]["authors"],
           tags: book["volumeInfo"]["categories"],
           cover_url: book["volumeInfo"]["imageLinks"]["large"] || book["volumeInfo"]["imageLinks"]["thumbnail"],
           description: book["volumeInfo"]["description"]
         }}

      _ ->
        {:not_found}
    end
  end
end
