defmodule ReadtomeWeb.Schema.ThingTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  import Absinthe.Resolution.Helpers, only: [dataloader: 3]

  @desc "An Unfurled link"
  object :unfurled_link do
    field(:type, :interest_type)
    field(:title, :string)
    field(:thumbnail, :string)
    field(:author_name, :string)
  end

  @desc "A Follow Object"
  object :follow do
    field(:id, non_null(:id))
    field(:user, :reader, resolve: dataloader(User, :user, []))
    field(:follower, :reader, resolve: dataloader(User, :follower, []))
    field(:inserted_at, :naive_datetime)
  end
end
