defmodule ReadtomeWeb.Resolvers.Connector do
  alias Readtome.{Helper, Connector}

  def accept(_parent, args, %{context: %{current_user: user}}) when not is_nil(user) do
    with {:ok, updated_inquiry} <- Connector.respond(args.inquiry_id, user, "accept"),
         inquiry <- Helper.populate(updated_inquiry, [:book_instance]) do
      {:ok, inquiry}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could not create instance"}
    end
  end

  def reject(_parent, args, %{context: %{current_user: user}}) when not is_nil(user) do
    with {:ok, updated_inquiry} <- Connector.respond(args.inquiry_id, user, "reject"),
         inquiry <- Helper.populate(updated_inquiry, [:book_instance]) do
      {:ok, inquiry}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could not create instance"}
    end
  end
end
