defmodule Readtome.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :age, :integer
    field :email, :string
    field :name, :string
    field :sex, :string

    has_many :book_instances, Readtome.Books.BookInstance

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :sex, :age])
    |> validate_required([:name, :email, :sex, :age])
  end
end
