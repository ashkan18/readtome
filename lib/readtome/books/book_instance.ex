defmodule Readtome.Books.BookInstance do
  use Ecto.Schema
  import Ecto.Changeset

  schema "book_instances" do
    field(:medium, Ecto.Enum, values: [:pdf, :paperback, :hardcover])
    field(:offerings, {:array, Ecto.Enum}, values: [:borrow, :read])
    field(:location, Geo.PostGIS.Geometry)
    field(:availability, :string)

    belongs_to(:user, Readtome.Accounts.User)
    belongs_to(:book, Readtome.Books.Book)

    timestamps()
  end

  @doc false
  def changeset(book_instance, attrs) do
    book_instance
    |> cast(attrs, [:medium, :offerings, :location, :book_id, :user_id])
    |> validate_required([:medium, :offerings, :location])
    |> assoc_constraint(:user)
    |> assoc_constraint(:book)
  end
end
