defmodule ReadtomeWeb.Schema.BookTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  import Absinthe.Resolution.Helpers, only: [dataloader: 1, dataloader: 3]

  connection(node_type: :creator)

  @desc "A Book"
  object :book do
    field(:id, :id)
    field(:title, :string)
    field(:isbn, :string)
    field(:tags, list_of(:string))
    field(:large_cover_url, :string)
    field(:medium_cover_url, :string)
    field(:small_cover_url, :string)

    connection field(:creators, node_type: :creator) do
      resolve(fn
        pagination_args, %{source: book} ->
          book = Readtome.Repo.preload(book, :creators)
          Absinthe.Relay.Connection.from_list(book.creators, pagination_args)
      end)
    end
  end

  @desc "A Book Instance"
  object :book_instance do
    field(:id, :id)
    field(:book, :book, resolve: dataloader(Book))
    field(:location, :location)
    field(:medium, :medium)
    field(:offerings, list_of(:offering))

    field(:reader, :reader, resolve: dataloader(User, :user, []))
  end
end
