defmodule Readtome.Connector.Inquiry do
  use Ecto.Schema
  import Ecto.Changeset

  schema "inquiries" do
    field(:offering, Ecto.Enum, values: [:borrow, :read])
    field(:status, Ecto.Enum, values: [:pending, :accepted, :rejected])

    belongs_to(:user, Readtome.Accounts.User)
    belongs_to(:book_instance, Readtome.Books.BookInstance)

    timestamps()
  end

  @doc false
  def changeset(inquiry, attrs) do
    inquiry
    |> cast(attrs, [:offering, :book_instance_id, :user_id, :status])
    |> validate_required([:user_id, :book_instance_id, :offering])
    |> assoc_constraint(:user)
    |> assoc_constraint(:book_instance)
  end
end
