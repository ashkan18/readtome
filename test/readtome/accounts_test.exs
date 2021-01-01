defmodule Readtome.AccountsTest do
  use Readtome.DataCase

  alias Readtome.Accounts

  describe "user_interests" do
    alias Readtome.Accounts.UserInterest

    @valid_attrs %{ref: "some ref", title: "some title", type: "some type"}
    @update_attrs %{ref: "some updated ref", title: "some updated title", type: "some updated type"}
    @invalid_attrs %{ref: nil, title: nil, type: nil}

    def user_interest_fixture(attrs \\ %{}) do
      {:ok, user_interest} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Accounts.create_user_interest()

      user_interest
    end

    test "list_user_interests/0 returns all user_interests" do
      user_interest = user_interest_fixture()
      assert Accounts.list_user_interests() == [user_interest]
    end

    test "get_user_interest!/1 returns the user_interest with given id" do
      user_interest = user_interest_fixture()
      assert Accounts.get_user_interest!(user_interest.id) == user_interest
    end

    test "create_user_interest/1 with valid data creates a user_interest" do
      assert {:ok, %UserInterest{} = user_interest} = Accounts.create_user_interest(@valid_attrs)
      assert user_interest.ref == "some ref"
      assert user_interest.title == "some title"
      assert user_interest.type == "some type"
    end

    test "create_user_interest/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.create_user_interest(@invalid_attrs)
    end

    test "update_user_interest/2 with valid data updates the user_interest" do
      user_interest = user_interest_fixture()
      assert {:ok, %UserInterest{} = user_interest} = Accounts.update_user_interest(user_interest, @update_attrs)
      assert user_interest.ref == "some updated ref"
      assert user_interest.title == "some updated title"
      assert user_interest.type == "some updated type"
    end

    test "update_user_interest/2 with invalid data returns error changeset" do
      user_interest = user_interest_fixture()
      assert {:error, %Ecto.Changeset{}} = Accounts.update_user_interest(user_interest, @invalid_attrs)
      assert user_interest == Accounts.get_user_interest!(user_interest.id)
    end

    test "delete_user_interest/1 deletes the user_interest" do
      user_interest = user_interest_fixture()
      assert {:ok, %UserInterest{}} = Accounts.delete_user_interest(user_interest)
      assert_raise Ecto.NoResultsError, fn -> Accounts.get_user_interest!(user_interest.id) end
    end

    test "change_user_interest/1 returns a user_interest changeset" do
      user_interest = user_interest_fixture()
      assert %Ecto.Changeset{} = Accounts.change_user_interest(user_interest)
    end
  end
end
