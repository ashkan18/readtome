defmodule ReadtomeWeb.Schema.BookTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

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
    field(:authors, list_of(:author))
  end

  @desc "A reader"
  object :reader do
    field(:id, :id)
    field(:name, :string)
    field(:photos, :json)
  end

  @desc "A Book Instance"
  object :book_instance do
    field(:id, :id)
    field(:book, :book)
    field(:location, :location)
    field(:medium, :string)
    field(:condition, :string)

    field :reader, :reader do
      resolve(fn parent, _, _ -> {:ok, parent.user} end)
    end
  end
end
