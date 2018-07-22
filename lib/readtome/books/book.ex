defmodule Readtome.Books.Book do
  use Ecto.Schema
  import Ecto.Changeset


  schema "books" do
    field :isbn, :string
    field :large_cover_url, :string
    field :medium_cover_url, :string
    field :title, :string
    field :small_cover_url, :string

    many_to_many :authors, Readtome.Authors.Author, join_through: Readtome.Books.BookAuthor
    has_many :instances, Readtome.Books.BookInstance

    timestamps()
  end

  @doc false
  def changeset(book, attrs) do
    book
    |> cast(attrs, [:title, :isbn, :small_cover_url, :medium_cover_url, :large_cover_url])
    |> validate_required([:title, :isbn])
  end
end
