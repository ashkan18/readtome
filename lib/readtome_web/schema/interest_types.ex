defmodule ReadtomeWeb.Schema.InterestTypes do
  alias Readtome.Helper
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  import Absinthe.Resolution.Helpers, only: [dataloader: 3]

  @desc "An Creator"
  object :creator do
    field(:id, :id)
    field(:name, :string)
    field(:bio, :string)

    connection field(:user_interests, node_type: :user_interest) do
      resolve(fn
        pagination_args, %{source: creator} ->
          creator = Helper.populate(creator, [:user_interests])
          Absinthe.Relay.Connection.from_list(creator.user_interests, pagination_args)
      end)
    end
  end

  @desc "An Unfurled link"
  object :unfurled_link do
    field(:type, :interest_type)
    field(:title, :string)
    field(:thumbnail, :string)
    field(:author_name, :string)
  end

  @desc "A UserInterest"
  object :user_interest do
    field(:id, :id)
    field(:type, :interest_type)
    field(:ref, :string)
    field(:title, :string)
    field(:thumbnail, :string)
    field(:inserted_at, :naive_datetime)
    field(:looking_for, :boolean)

    field(:user, :reader, resolve: dataloader(User, :user, []))

    connection field(:creators, node_type: :creator) do
      resolve(fn
        pagination_args, %{source: user_interest} ->
          user_interest = Helper.populate(user_interest, [:creators])
          Absinthe.Relay.Connection.from_list(user_interest.creators, pagination_args)
      end)
    end
  end
end
