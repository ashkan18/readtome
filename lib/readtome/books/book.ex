defmodule Readtome.Books.Book do
  use Ecto.Schema
  import Ecto.Changeset


  schema "books" do
    field :condition, :string
    field :isbn, :string
    field :large_cover_url, :string
    field :medium_cover_url, :string
    field :name, :string
    field :small_cover_url, :string

    timestamps()
  end

  @doc false
  def changeset(book, attrs) do
    book
    |> cast(attrs, [:name, :isbn, :small_cover_url, :medium_cover_url, :large_cover_url, :condition])
    |> validate_required([:name, :isbn, :small_cover_url, :medium_cover_url, :large_cover_url, :condition])
  end
end
