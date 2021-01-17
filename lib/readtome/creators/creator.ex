defmodule Readtome.Creators.Creator do
  use Ecto.Schema
  import Ecto.Changeset

  schema "creators" do
    field(:bio, :string)
    field(:name, :string)

    many_to_many(:user_interests, Readtome.Accounts.UserInterest, join_through: Readtome.Creators.UserInterestCreator)
    timestamps()
  end

  @doc false
  def changeset(creator, attrs) do
    creator
    |> cast(attrs, [:name, :bio])
    |> validate_required([:name])
    |> unique_constraint(:name)
  end
end
