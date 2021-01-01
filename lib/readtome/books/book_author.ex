defmodule Readtome.Books.BookCreator do
  use Ecto.Schema
  import Ecto.Changeset

  schema "book_creators" do
    belongs_to(:book, Readtome.Books.Book)
    belongs_to(:creator, Readtome.Creators.Creator)

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(book_creator, attrs) do
    book_creator
    |> cast(attrs, [:book_id, :creator_id])
    |> validate_required([:book_id, :creator_id])
    |> foreign_key_constraint(:book_id)
    |> foreign_key_constraint(:creator_id)
    |> assoc_constraint(:book)
    |> assoc_constraint(:creator)
  end
end
