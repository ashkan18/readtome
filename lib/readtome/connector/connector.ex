defmodule Readtome.Connector do
  @moduledoc """
  The Connector context.
  """

  import Ecto.Query, warn: false
  alias Readtome.{Repo}

  alias Readtome.Connector.{Follow}
  alias Readtome.Accounts.UserInterest

  def follow(attrs \\ %{}) do
    %Follow{}
    |> Follow.changeset(attrs)
    |> Repo.insert()
  end

  def my_feed(user) do
    from(ui in UserInterest,
      join: f in Follow,
      on: f.user_id == ui.user_id,
      where: f.follower_id == ^user.id
    )
    |> Repo.all()
  end

  def follows?(user1, user2) do
    from(f in Follow,
      where: f.follower_id == ^user1.id and f.user_id == ^user2.id
    )
    |> Repo.exists?()
  end

  def list_user_interests(args) do
    UserInterest
    |> by_term(args)
    |> by_types(args)
    |> near(args)
    |> filter_users(args)
    |> Repo.all()
  end

  def near(query, %{lat: lat, lng: lng}) do
    point = %Geo.Point{coordinates: {lng, lat}, srid: 4326}
    {lng, lat} = point.coordinates

    from(book_instance in query,
      order_by: fragment("? <-> ST_SetSRID(ST_MakePoint(?,?), ?)", book_instance.location, ^lng, ^lat, ^point.srid)
    )
  end

  def near(query, _), do: query

  def by_term(query, %{term: term}) when not is_nil(term) do
    from(ui in query,
      join: user in assoc(ui, :user),
      join: creator in assoc(ui, :creators),
      where: fragment("LOWER(?) % LOWER(?) OR LOWER(?) % LOWER(?) OR LOWER(?) % LOWER(?)", ui.title, ^term, user.username, ^term, creator.name, ^term),
      order_by: fragment("similarity(LOWER(?), LOWER(?)) DESC", ui.title, ^term)
    )
  end

  def by_term(query, _), do: query

  def by_types(query, %{types: types}) do
    from(ui in query,
      where: ui.types in ^types
    )
  end

  def by_types(query, _), do: query

  def filter_users(query, %{filter_user_ids: filter_user_ids}) do
    from(ui in query,
      where: ui.user_id not in ^filter_user_ids
    )
  end

  def filter_users(query, _), do: query
end
