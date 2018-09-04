defmodule Readtome.Connector do
  @moduledoc """
  The Connector context.
  """

  import Ecto.Query, warn: false
  alias Readtome.Repo

  alias Readtome.Connector.Inquiry

  @doc """
  Returns the list of inquries.

  ## Examples

      iex> list_inquries()
      [%Inquiry{}, ...]

  """
  def list_inquries do
    Repo.all(Inquiry)
  end

  @doc """
  Gets a single inquiry.

  Raises `Ecto.NoResultsError` if the Inquiry does not exist.

  ## Examples

      iex> get_inquiry!(123)
      %Inquiry{}

      iex> get_inquiry!(456)
      ** (Ecto.NoResultsError)

  """
  def get_inquiry!(id), do: Repo.get!(Inquiry, id)

  @doc """
  Creates a inquiry.

  ## Examples

      iex> create_inquiry(%{field: value})
      {:ok, %Inquiry{}}

      iex> create_inquiry(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_inquiry(attrs \\ %{}) do
    %Inquiry{}
    |> Inquiry.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a inquiry.

  ## Examples

      iex> update_inquiry(inquiry, %{field: new_value})
      {:ok, %Inquiry{}}

      iex> update_inquiry(inquiry, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_inquiry(%Inquiry{} = inquiry, attrs) do
    inquiry
    |> Inquiry.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Inquiry.

  ## Examples

      iex> delete_inquiry(inquiry)
      {:ok, %Inquiry{}}

      iex> delete_inquiry(inquiry)
      {:error, %Ecto.Changeset{}}

  """
  def delete_inquiry(%Inquiry{} = inquiry) do
    Repo.delete(inquiry)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking inquiry changes.

  ## Examples

      iex> change_inquiry(inquiry)
      %Ecto.Changeset{source: %Inquiry{}}

  """
  def change_inquiry(%Inquiry{} = inquiry) do
    Inquiry.changeset(inquiry, %{})
  end
end
