defmodule ReadtomeWeb.Schema.UserTypes do
  alias Readtome.Connector
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  connection(node_type: :inquiry)

  @desc "A reader"
  object :reader do
    field(:id, :id)
    field(:name, :string)
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
  end

  @desc "An Inquiry"
  object :inquiry do
    field(:id, :id)
    field(:type, :string)
    field(:user, :reader)

    field(:book_instance, :book_instance) do
      resolve(fn inquiry, _, _ ->
        inquiry =
          inquiry
          |> Readtome.Helper.populate([:book_instance])

        {:ok, inquiry.book_instance}
      end)
    end
  end
end
