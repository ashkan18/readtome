defmodule Readtome.Authors.Author do
  use Ecto.Schema
  import Ecto.Changeset

  schema "authors" do
    field(:bio, :string)
    field(:name, :string)

    many_to_many(:books, Readtome.Books.Book, join_through: Readtome.Books.BookAuthor)
    timestamps()
  end

  @doc false
  def changeset(author, attrs) do
    author
    |> cast(attrs, [:name, :bio])
    |> validate_required([:name])
  end
end
