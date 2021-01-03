defmodule Readtome.Accounts.UserInterest do
  use Ecto.Schema
  import Ecto.Changeset

  schema "user_interests" do
    field(:ref, :string)
    field(:title, :string)
    field(:type, Ecto.Enum, values: [:read, :watched, :saw, :listened])
    field(:thumbnail, :string)
    belongs_to(:user, Readtome.Accounts.User)
    many_to_many(:creators, Readtome.Creators.Creator, join_through: Readtome.Creators.UserInterestCreator)

    timestamps()
  end

  @doc false
  def changeset(user_interest, attrs) do
    user_interest
    |> cast(attrs, [:title, :type, :ref, :user_id, :thumbnail])
    |> validate_required([:title, :type, :ref, :user_id])
    |> assoc_constraint(:user)
  end
end
