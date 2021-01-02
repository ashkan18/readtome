defmodule ReadtomeWeb.Schema.CreatorTypes do
  alias Readtome.Helper
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

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
end
