defmodule ReadtomeWeb.Schema.ConnectorTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  import Absinthe.Resolution.Helpers, only: [dataloader: 3]

  @desc "An Inquiry"
  object :inquiry do
    field(:id, :id)
    field(:offering, :offering)
    field(:status, :string)

    field :user, :reader do
      resolve(fn inquiry, _, _ ->
        inquiry = Readtome.Helper.populate(inquiry, [:user])
        {:ok, inquiry.user}
      end)
    end

    field(:book_instance, :book_instance) do
      resolve(fn inquiry, _, _ ->
        inquiry =
          inquiry
          |> Readtome.Helper.populate([:book_instance])

        {:ok, inquiry.book_instance}
      end)
    end
  end

  @desc "A Follow Object"
  object :follow do
    field(:id, non_null(:id))
    field(:user, :reader, resolve: dataloader(User, :user, []))
    field(:follower, :reader, resolve: dataloader(User, :follower, []))
    field(:inserted_at, :naive_datetime)
  end
end
