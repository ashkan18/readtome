defmodule Readtome.CreatorsTest do
  use Readtome.DataCase

  alias Readtome.Creators

  describe "creators" do
    alias Readtome.Creators.Creator

    @valid_attrs %{bio: "some bio", name: "some name"}
    @update_attrs %{bio: "some updated bio", name: "some updated name"}
    @invalid_attrs %{bio: nil, name: nil}

    def creator_fixture(attrs \\ %{}) do
      {:ok, creator} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Creators.create_creator()

      creator
    end

    test "list_creators/0 returns all creators" do
      creator = creator_fixture()
      assert Creators.list_creators() == [creator]
    end

    test "get_creator!/1 returns the creator with given id" do
      creator = creator_fixture()
      assert Creators.get_creator!(creator.id) == creator
    end

    test "create_creator/1 with valid data creates a creator" do
      assert {:ok, %Creator{} = creator} = Creators.create_creator(@valid_attrs)
      assert creator.bio == "some bio"
      assert creator.name == "some name"
    end

    test "create_creator/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Creators.create_creator(@invalid_attrs)
    end

    test "update_creator/2 with valid data updates the creator" do
      creator = creator_fixture()
      assert {:ok, creator} = Creators.update_creator(creator, @update_attrs)
      assert %Creator{} = creator
      assert creator.bio == "some updated bio"
      assert creator.name == "some updated name"
    end

    test "update_creator/2 with invalid data returns error changeset" do
      creator = creator_fixture()
      assert {:error, %Ecto.Changeset{}} = Creators.update_creator(creator, @invalid_attrs)
      assert creator == Creators.get_creator!(creator.id)
    end

    test "delete_creator/1 deletes the creator" do
      creator = creator_fixture()
      assert {:ok, %Creator{}} = Creators.delete_creator(creator)
      assert_raise Ecto.NoResultsError, fn -> Creators.get_creator!(creator.id) end
    end

    test "change_creator/1 returns a creator changeset" do
      creator = creator_fixture()
      assert %Ecto.Changeset{} = Creators.change_creator(creator)
    end
  end
end
