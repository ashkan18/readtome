defmodule ReadtomeWeb.Resolvers.User do
  alias Readtome.{Accounts, Helper, Creators, Connector}

  def me(_parent, _args, %{context: %{current_user: user}}) do
    {:ok, user}
  end

  def find_by_id(_parent, %{id: id}, _context) do
    {:ok, Accounts.get_user(id)}
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

  def add_interest(parent, args = %{creator_names: creator_names}, context) when not is_nil(creator_names) and is_list(creator_names) do
    creator_ids =
      creator_names
      |> Enum.map(&Creators.add_by_name/1)
      |> Enum.reject(&is_nil/1)
      |> Enum.map(fn c -> c.id end)

    args =
      args
      |> Map.delete(:creator_names)
      |> Map.update(:creator_ids, creator_ids, fn current_creator_ids -> current_creator_ids ++ creator_ids end)
      |> IO.inspect(label: "===>")

    add_interest(parent, args, context)
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

  def update_profile(_, args, %{context: %{current_user: user}}) do
    case Accounts.add_user_profile_photo(user, args.photo) do
      {:ok, user} -> {:ok, user}
      _ -> {:error, "Couldn't upload"}
    end
  end

  def follow(_, %{user_id: user_id}, %{context: %{current_user: user}}) do
    case Connector.follow(%{follower_id: user.id, user_id: user_id}) do
      {:ok, follow} -> {:ok, follow}
      {:error, %Ecto.Changeset{} = changeset} -> {:error, Helper.convert_changeset_errors(changeset)}
      _ -> {:error, "Could not follow"}
    end
  end
end
