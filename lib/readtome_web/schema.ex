defmodule ReadtomeWeb.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern

  import_types(ReadtomeWeb.Schema.JSON)
  import_types(ReadtomeWeb.Schema.LocationType)
  import_types(ReadtomeWeb.Schema.BookTypes)

  alias ReadtomeWeb.Resolvers

  query do
    @desc "Find Book Instance by location"
    field :book_instances, list_of(:book_instance) do
      arg(:lat, non_null(:float))
      arg(:lng, non_null(:float))
      arg(:term, :string)
      arg(:offerings, list_of(:string))
      resolve(&Resolvers.Book.find_book_instances/3)
    end

    field :book, :book do
      arg(:isbn, :string)
      resolve(&Resolvers.Book.find_by_isbn/3)
    end
  end

  mutation do
    @desc "Create a book offering"
    field :post_book, type: :book_instance do
      arg(:book_id, non_null(:id))
      arg(:lat, non_null(:float))
      arg(:lng, non_null(:float))
      arg(:offerings, :string)
      arg(:medium, non_null(:string))

      resolve(&Resolvers.BookInstance.post_book/3)
    end
  end
end
