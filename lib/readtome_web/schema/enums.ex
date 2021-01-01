defmodule ReadtomeWeb.Schema.EnumTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  enum :medium do
    value(:pdf)
    value(:paperback)
    value(:hardcover)
  end

  enum :offering do
    value(:read)
    value(:borrow)
  end

  enum :interest_type do
    value(:read)
    value(:watched)
    value(:saw)
    value(:listened)
  end
end
