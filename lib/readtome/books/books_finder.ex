defmodule Readtome.BooksFinder do
  def by_isbn(isbn) do
    case google_books(isbn) do
      {:found, book} -> {:found, %Book{isbn: isbn}}
      _ ->
        case isbn_db(isbn) do
          {:found, book} -> {:found, %Book{isbn: isbn}}
          _ -> {:not_found}
        end
    end
  end

  defp google_books(isbn) do
    {:found, 1}
  end

  defp isbn_db(isbn) do
    {:found, 2}
  end
end