defmodule Readtome.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Comeonin.Bcrypt

  schema "users" do
    field(:email, :string)
    field(:name, :string)
    field(:sex, :string)
    field(:username, :string)
    field(:password, :string)
    field(:birthdate, :date)
    field(:photos, {:array, :map})

    has_many(:interests, Readtome.Accounts.UserInterest)
    has_many(:follows, Readtome.Connector.Follow, foreign_key: :follower_id)
    has_many(:followers, Readtome.Connector.Follow)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :sex, :birthdate, :username, :password, :photos])
    |> validate_required([:name, :email, :username, :password])
    |> unique_constraint(:username)
    |> put_pass_hash()
  end

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, password: Bcrypt.hashpwsalt(password))
  end

  defp put_pass_hash(changeset), do: changeset
end
