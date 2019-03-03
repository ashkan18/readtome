defmodule Readtome.Connector.Message do
  use Ecto.Schema
  import Ecto.Changeset


  schema "messages" do
    field :inquiry_id, :id
    field :from_id, :id
    field :to_id, :id

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [])
    |> validate_required([])
  end
end
