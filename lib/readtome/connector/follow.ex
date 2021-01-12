defmodule Readtome.Connector.Follow do
  use Ecto.Schema
  import Ecto.Changeset

  schema "follows" do
    belongs_to(:user, Readtome.Accounts.User)
    belongs_to(:follower, Readtome.Accounts.User, foreign_key: :follower_id)

    timestamps()
  end

  @doc false
  def changeset(follow, attrs) do
    follow
    |> cast(attrs, [:user_id, :follower_id])
    |> validate_required([:user_id, :follower_id])
    |> assoc_constraint(:user)
    |> assoc_constraint(:follower)
    |> unique_constraint([:user_id, :follower_id])
  end
end
