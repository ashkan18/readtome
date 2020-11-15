defmodule Readtome.Connector.Inquiry do
  use Ecto.Schema
  import Ecto.Changeset

  schema "inquiries" do
    field(:type, :string)

    belongs_to(:user, Readtome.Accounts.User)
    belongs_to(:book_instance, Readtome.Books.BookInstance)

    timestamps()
  end

  @doc false
  def changeset(inquiry, attrs) do
    inquiry
    |> cast(attrs, [:type, :book_instance_id, :user_id])
    |> validate_required([:user_id, :book_instance_id, :type])
    |> assoc_constraint(:user)
    |> assoc_constraint(:book_instance)
  end
end
