defmodule Readtome.Creators.UserInterestCreator do
  use Ecto.Schema
  import Ecto.Changeset

  schema "user_interest_creators" do
    belongs_to(:user_interest, Readtome.Accounts.UserInterest)
    belongs_to(:creator, Readtome.Creators.Creator)

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(book_creator, attrs) do
    book_creator
    |> cast(attrs, [:user_interest_id, :creator_id])
    |> validate_required([:user_interest_id, :creator_id])
    |> foreign_key_constraint(:user_interest_id)
    |> foreign_key_constraint(:creator_id)
    |> assoc_constraint(:user_interest)
    |> assoc_constraint(:creator)
  end
end
