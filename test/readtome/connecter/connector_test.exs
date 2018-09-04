defmodule Readtome.ConnectorTest do
  use Readtome.DataCase

  alias Readtome.Connector

  describe "inquries" do
    alias Readtome.Connector.Inquiry

    @valid_attrs %{type: "some type"}
    @update_attrs %{type: "some updated type"}
    @invalid_attrs %{type: nil}

    def inquiry_fixture(attrs \\ %{}) do
      {:ok, inquiry} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Connector.create_inquiry()

      inquiry
    end

    test "list_inquries/0 returns all inquries" do
      inquiry = inquiry_fixture()
      assert Connector.list_inquries() == [inquiry]
    end

    test "get_inquiry!/1 returns the inquiry with given id" do
      inquiry = inquiry_fixture()
      assert Connector.get_inquiry!(inquiry.id) == inquiry
    end

    test "create_inquiry/1 with valid data creates a inquiry" do
      assert {:ok, %Inquiry{} = inquiry} = Connector.create_inquiry(@valid_attrs)
      assert inquiry.type == "some type"
    end

    test "create_inquiry/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Connector.create_inquiry(@invalid_attrs)
    end

    test "update_inquiry/2 with valid data updates the inquiry" do
      inquiry = inquiry_fixture()
      assert {:ok, inquiry} = Connector.update_inquiry(inquiry, @update_attrs)
      assert %Inquiry{} = inquiry
      assert inquiry.type == "some updated type"
    end

    test "update_inquiry/2 with invalid data returns error changeset" do
      inquiry = inquiry_fixture()
      assert {:error, %Ecto.Changeset{}} = Connector.update_inquiry(inquiry, @invalid_attrs)
      assert inquiry == Connector.get_inquiry!(inquiry.id)
    end

    test "delete_inquiry/1 deletes the inquiry" do
      inquiry = inquiry_fixture()
      assert {:ok, %Inquiry{}} = Connector.delete_inquiry(inquiry)
      assert_raise Ecto.NoResultsError, fn -> Connector.get_inquiry!(inquiry.id) end
    end

    test "change_inquiry/1 returns a inquiry changeset" do
      inquiry = inquiry_fixture()
      assert %Ecto.Changeset{} = Connector.change_inquiry(inquiry)
    end
  end
end
