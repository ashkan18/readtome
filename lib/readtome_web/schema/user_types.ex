defmodule ReadtomeWeb.Schema.UserTypes do
  alias Readtome.{Connector, Helper, Accounts}
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  connection(node_type: :user_interest)
  connection(node_type: :follow)

  @desc "A reader"
  object :reader do
    field(:id, :id)
    field(:name, :string)
    field(:username, :string)
    field(:photos, :json)

    field(:am_i_following, :boolean) do
      resolve(fn reader, _, %{context: %{current_user: user}} ->
        {:ok, Connector.follows?(user, reader)}
      end)
    end

    connection field(:interests, node_type: :user_interest) do
      arg(:interest_types, list_of(:interest_type))

      resolve(fn
        args, %{source: user} ->
          user
          |> Accounts.user_interests(args)
          |> Absinthe.Relay.Connection.from_list(args)
      end)
    end

    connection field(:follows, node_type: :follow) do
      resolve(fn
        pagination_args, %{source: user} ->
          user = Helper.populate(user, [:follows])
          Absinthe.Relay.Connection.from_list(user.follows, pagination_args)
      end)
    end

    connection field(:followers, node_type: :follow) do
      resolve(fn
        pagination_args, %{source: user} ->
          user = Helper.populate(user, [:followers])
          Absinthe.Relay.Connection.from_list(user.followers, pagination_args)
      end)
    end

    connection field(:feed, node_type: :user_interest) do
      resolve(fn
        pagination_args, %{source: user} ->
          my_feed = Connector.my_feed(user)
          Absinthe.Relay.Connection.from_list(my_feed, pagination_args)
      end)
    end
  end

  @desc "ME"
  object :me do
    field(:id, :id)
    field(:name, :string)
    field(:email, :string)
    field(:username, :string)
    field(:photos, :json)

    connection field(:interests, node_type: :user_interest) do
      arg(:interest_types, list_of(:interest_type))

      resolve(fn
        args, %{source: user} ->
          user
          |> Accounts.user_interests(args)
          |> Absinthe.Relay.Connection.from_list(args)
      end)
    end

    connection field(:follows, node_type: :follow) do
      resolve(fn
        pagination_args, %{source: user} ->
          user = Helper.populate(user, [:follows])
          Absinthe.Relay.Connection.from_list(user.follows, pagination_args)
      end)
    end

    connection field(:followers, node_type: :follow) do
      resolve(fn
        pagination_args, %{source: user} ->
          user = Helper.populate(user, [:followers])
          Absinthe.Relay.Connection.from_list(user.followers, pagination_args)
      end)
    end

    connection field(:feed, node_type: :user_interest) do
      resolve(fn
        pagination_args, %{source: user} ->
          my_feed = Connector.my_feed(user)
          Absinthe.Relay.Connection.from_list(my_feed, pagination_args)
      end)
    end
  end

  @desc "Auth Response"
  object :auth do
    field(:token, :string)
  end
end
