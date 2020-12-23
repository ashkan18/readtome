defmodule ReadtomeWeb.Resolvers.BookInstance do
  alias Readtome.Books

  def post_book(_parent, args, %{context: %{current_user: user}}) do
    with {:ok, book_instance} <- Books.create_book_instance(user, args),
         book_instance <- Books.populate(book_instance, [:book, :user]) do
      {:ok, book_instance}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, convert_changeset_errors(changeset)}
      _ -> {:error, "Could not create instance"}
    end
  end

  defp convert_changeset_errors(%Ecto.Changeset{errors: errors}) do
    errors
    |> Enum.map(fn {attr, {msg, _}} -> [message: "#{attr}: #{msg}"] end)
  end
end
