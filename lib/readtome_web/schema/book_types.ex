defmodule ReadtomeWeb.Schema.BookTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  import Absinthe.Resolution.Helpers, only: [dataloader: 1, dataloader: 3]

  connection(node_type: :author)

  @desc "An Author"
  object :author do
    field(:id, :id)
    field(:name, :string)
    field(:bio, :string)
  end

  @desc "A Book"
  object :book do
    field(:id, :id)
    field(:title, :string)
    field(:isbn, :string)
    field(:tags, list_of(:string))
    field(:large_cover_url, :string)
    field(:medium_cover_url, :string)
    field(:small_cover_url, :string)

    connection field(:authors, node_type: :author) do
      resolve(fn
        pagination_args, %{source: book} ->
          book = Readtome.Repo.preload(book, :authors)
          Absinthe.Relay.Connection.from_list(book.authors, pagination_args)
      end)
    end
  end

  enum :medium do
    value(:pdf)
    value(:paperback)
    value(:hardcover)
  end

  enum :offering do
    value(:read)
    value(:borrow)
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
