defmodule Readtome.Books.BookAuthor do
  use Ecto.Schema
  import Ecto.Changeset

  schema "book_authors" do
    belongs_to :book, Readtome.Books.Book
    belongs_to :author, Readtome.Authors.Author

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(book_author, attrs) do
    book_author
    |> cast(attrs, [:book_id, :author_id])
    |> validate_required([:book_id, :author_id])
  end
end
