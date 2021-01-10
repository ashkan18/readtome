defmodule ReadtomeWeb.Schema.UserTypes do
  alias Readtome.{Connector, Helper, Accounts}
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  import Absinthe.Resolution.Helpers, only: [dataloader: 3]

  connection(node_type: :inquiry)
  connection(node_type: :user_interest)

  @desc "A reader"
  object :reader do
    field(:id, :id)
    field(:name, :string)
    field(:email, :string)
    field(:photos, :json)

    connection field(:inquiries, node_type: :inquiry) do
      resolve(fn
        pagination_args, %{source: user} ->
          inquiries = Connector.list_inquiries(user.id)
          Absinthe.Relay.Connection.from_list(inquiries, pagination_args)
      end)
    end

    connection field(:requests, node_type: :inquiry) do
      resolve(fn
        pagination_args, %{source: user} ->
          requests = Connector.list_requests(user.id)
          Absinthe.Relay.Connection.from_list(requests, pagination_args)
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
  end

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

  @desc "A UserInterest"
  object :user_interest do
    field(:id, :id)
    field(:type, :interest_type)
    field(:ref, :string)
    field(:title, :string)
    field(:thumbnail, :string)
    field(:inserted_at, :naive_datetime)

    field(:user, :reader, resolve: dataloader(User, :user, []))

    connection field(:creators, node_type: :creator) do
      resolve(fn
        pagination_args, %{source: user_interest} ->
          user_interest = Helper.populate(user_interest, [:creators])
          Absinthe.Relay.Connection.from_list(user_interest.creators, pagination_args)
      end)
    end
  end

  @desc "Auth Response"
  object :auth do
    field(:token, :string)
  end
end
