defmodule Readtome.Creators.Creator do
  use Ecto.Schema
  import Ecto.Changeset

  schema "creators" do
    field(:bio, :string)
    field(:name, :string)

    many_to_many(:books, Readtome.Books.Book, join_through: Readtome.Books.BookCreator)
    many_to_many(:user_interests, Readtome.Accounts.UserInterest, join_through: Readtome.Creators.CreatorUserInterest)
    timestamps()
  end

  @doc false
  def changeset(creator, attrs) do
    creator
    |> cast(attrs, [:name, :bio])
    |> validate_required([:name])
  end
end
