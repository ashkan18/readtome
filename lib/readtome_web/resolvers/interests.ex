defmodule ReadtomeWeb.Resolvers.Interests do
  alias Readtome.{Accounts, Helper, Creators, Connector}

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

    add_interest(parent, args, context)
  end

  def add_interest(parent, args = %{lat: lat, lng: lng}, ctx) do
    args =
      args
      |> Map.delete(:lat)
      |> Map.delete(:lng)
      |> Map.put(:location, %Geo.Point{coordinates: {lng, lat}, srid: 4326})

    add_interest(parent, args, ctx)
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

  def list_users_interests(_, args, %{context: %{current_user: user}}) do
    result =
      args
      |> Map.put(:filter_user_ids, [user.id])
      |> Connector.list_user_interests()

    {:ok, result}
  end
end
