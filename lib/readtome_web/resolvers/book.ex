defmodule ReadtomeWeb.Resolvers.Book do
  def find_book_instances(_parent, args, %{context: %{current_user: user}}) do
    result =
      args
      |> Map.put(:filter_user_ids, [user.id])
      |> Readtome.Books.list_book_instance()

    {:ok, result}
  end

  def find_by_isbn(_parent, %{isbn: isbn}, _res) do
    case Readtome.Books.find_in_the_wild(isbn) do
      {:found_and_stored, %{book: stored_book, external: _founded_book}} -> {:ok, stored_book}
      {:found, book} -> {:ok, book}
    end
  end
end
