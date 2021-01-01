defmodule ReadtomeWeb.Resolvers.User do
  alias Readtome.{Accounts, Helper}

  def me(_parent, _args, %{context: %{current_user: user}}) do
    {:ok, user}
  end

  def signup(_parent, args, _context) do
    with {:ok, user} <- Accounts.create_user(args),
         {:ok, token, _claims} <- ReadtomeWeb.Auth.Guardian.encode_and_sign(user) do
      {:ok, %{token: token}}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could not signup"}
    end
  end

  def login(_parent, %{username: username, password: password}, _context) do
    with {:ok, user} <- Accounts.authenticate_user(username, password),
         {:ok, token, _claims} <- ReadtomeWeb.Auth.Guardian.encode_and_sign(user) do
      {:ok, %{token: token}}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could not login"}
    end
  end

  def add_interest(_parent, args, %{context: %{current_user: user}}) do
    with args <- Map.put(args, :user_id, user.id),
         {:ok, user_interest} <- Accounts.create_user_interest(args) do
      {:ok, user_interest}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could add user interest"}
    end
  end
end
