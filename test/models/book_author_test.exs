defmodule Readtome.BookAuthorTest do
  use Readtome.ModelCase

  alias Readtome.BookAuthor

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = BookAuthor.changeset(%BookAuthor{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = BookAuthor.changeset(%BookAuthor{}, @invalid_attrs)
    refute changeset.valid?
  end
end
