defmodule ReadtomeWeb.Schema.ThingTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  @desc "An Unfurled link"
  object :unfurled_link do
    field(:type, :interest_type)
    field(:title, :string)
    field(:thumbnail, :string)
    field(:author_name, :string)
  end
end
