defmodule Readtome.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Comeonin.Bcrypt

  schema "users" do
    field :email, :string
    field :name, :string
    field :sex, :string
    field :username, :string
    field :password, :string
    field :birthdate, :date

    has_many :book_instances, Readtome.Books.BookInstance

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :sex, :birthdate, :username, :password])
    |> validate_required([:name, :email, :username, :password])
    |> put_pass_hash()
  end

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, password: Bcrypt.hashpwsalt(password))
  end
  defp put_pass_hash(changeset), do: changeset
end
