defmodule ReadtomeWeb.Resolvers.BookInstance do
  alias Readtome.{Books, Helper, Connector}

  def post_book(_parent, args, %{context: %{current_user: user}}) when not is_nil(user) do
    with {:ok, book_instance} <- Books.create_book_instance(user, args),
         book_instance <- Helper.populate(book_instance, [:book, :user]) do
      {:ok, book_instance}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could not create instance"}
    end
  end

  def inquiry(_parent, args, %{context: %{current_user: user}}) when not is_nil(user) do
    with args <- Map.put(args, :user_id, user.id),
         {:ok, inquiry} <- Connector.create_inquiry(args) do
      {:ok, inquiry}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could not create inquiry"}
    end
  end
end
