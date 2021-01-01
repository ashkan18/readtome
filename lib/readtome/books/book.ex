defmodule Readtome.Books.Book do
  use Ecto.Schema
  import Ecto.Changeset

  schema "books" do
    field(:isbn, :string)
    field(:title, :string)
    field(:tags, {:array, :string})
    field(:large_cover_url, :string)
    field(:medium_cover_url, :string)
    field(:small_cover_url, :string)

    many_to_many(:creators, Readtome.Creators.Creator, join_through: Readtome.Books.BookCreator)
    has_many(:instances, Readtome.Books.BookInstance)

    timestamps()
  end

  @doc false
  def changeset(book, attrs) do
    book
    |> cast(attrs, [:title, :isbn, :tags, :small_cover_url, :medium_cover_url, :large_cover_url])
    |> validate_required([:title, :isbn])
    |> unique_constraint(:isbn)
  end
end
