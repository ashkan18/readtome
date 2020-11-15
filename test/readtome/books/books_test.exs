defmodule Readtome.BooksTest do
  use Readtome.DataCase

  alias Readtome.Books

  describe "books" do
    alias Readtome.Books.Book

    @valid_attrs %{condition: "some condition", isbn: "some isbn", large_cover_url: "some large_cover_url", medium_cover_url: "some medium_cover_url", name: "some name", small_cover_url: "some small_cover_url"}
    @update_attrs %{
      condition: "some updated condition",
      isbn: "some updated isbn",
      large_cover_url: "some updated large_cover_url",
      medium_cover_url: "some updated medium_cover_url",
      name: "some updated name",
      small_cover_url: "some updated small_cover_url"
    }
    @invalid_attrs %{condition: nil, isbn: nil, large_cover_url: nil, medium_cover_url: nil, name: nil, small_cover_url: nil}

    def book_fixture(attrs \\ %{}) do
      {:ok, book} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Books.create_book()

      book
    end

    test "list_books/0 returns all books" do
      book = book_fixture()
      assert Books.list_books() == [book]
    end

    test "get_book!/1 returns the book with given id" do
      book = book_fixture()
      assert Books.get_book!(book.id) == book
    end

    test "create_book/1 with valid data creates a book" do
      assert {:ok, %Book{} = book} = Books.create_book(@valid_attrs)
      assert book.condition == "some condition"
      assert book.isbn == "some isbn"
      assert book.large_cover_url == "some large_cover_url"
      assert book.medium_cover_url == "some medium_cover_url"
      assert book.title == "some name"
      assert book.small_cover_url == "some small_cover_url"
    end

    test "create_book/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Books.create_book(@invalid_attrs)
    end

    test "update_book/2 with valid data updates the book" do
      book = book_fixture()
      assert {:ok, book} = Books.update_book(book, @update_attrs)
      assert %Book{} = book
      assert book.condition == "some updated condition"
      assert book.isbn == "some updated isbn"
      assert book.large_cover_url == "some updated large_cover_url"
      assert book.medium_cover_url == "some updated medium_cover_url"
      assert book.title == "some updated name"
      assert book.small_cover_url == "some updated small_cover_url"
    end

    test "update_book/2 with invalid data returns error changeset" do
      book = book_fixture()
      assert {:error, %Ecto.Changeset{}} = Books.update_book(book, @invalid_attrs)
      assert book == Books.get_book!(book.id)
    end

    test "delete_book/1 deletes the book" do
      book = book_fixture()
      assert {:ok, %Book{}} = Books.delete_book(book)
      assert_raise Ecto.NoResultsError, fn -> Books.get_book!(book.id) end
    end

    test "change_book/1 returns a book changeset" do
      book = book_fixture()
      assert %Ecto.Changeset{} = Books.change_book(book)
    end
  end

  describe "book_instance" do
    alias Readtome.Books.BookInstance

    @valid_attrs %{condition: "some condition", medium: "some medium", offerings: "some offerings"}
    @update_attrs %{condition: "some updated condition", medium: "some updated medium", offerings: "some updated offerings"}
    @invalid_attrs %{condition: nil, medium: nil, offerings: nil}

    def book_instance_fixture(attrs \\ %{}) do
      {:ok, book_instance} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Books.create_book_instance()

      book_instance
    end

    test "list_book_instance/0 returns all book_instance" do
      book_instance = book_instance_fixture()
      assert Books.list_book_instance() == [book_instance]
    end

    test "get_book_instance!/1 returns the book_instance with given id" do
      book_instance = book_instance_fixture()
      assert Books.get_book_instance!(book_instance.id) == book_instance
    end

    test "create_book_instance/1 with valid data creates a book_instance" do
      assert {:ok, %BookInstance{} = book_instance} = Books.create_book_instance(@valid_attrs)
      assert book_instance.condition == "some condition"
      assert book_instance.medium == "some medium"
      assert book_instance.offerings == "some offerings"
    end

    test "create_book_instance/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Books.create_book_instance(@invalid_attrs)
    end

    test "update_book_instance/2 with valid data updates the book_instance" do
      book_instance = book_instance_fixture()
      assert {:ok, book_instance} = Books.update_book_instance(book_instance, @update_attrs)
      assert %BookInstance{} = book_instance
      assert book_instance.condition == "some updated condition"
      assert book_instance.medium == "some updated medium"
      assert book_instance.offerings == "some updated offerings"
    end

    test "update_book_instance/2 with invalid data returns error changeset" do
      book_instance = book_instance_fixture()
      assert {:error, %Ecto.Changeset{}} = Books.update_book_instance(book_instance, @invalid_attrs)
      assert book_instance == Books.get_book_instance!(book_instance.id)
    end

    test "delete_book_instance/1 deletes the book_instance" do
      book_instance = book_instance_fixture()
      assert {:ok, %BookInstance{}} = Books.delete_book_instance(book_instance)
      assert_raise Ecto.NoResultsError, fn -> Books.get_book_instance!(book_instance.id) end
    end

    test "change_book_instance/1 returns a book_instance changeset" do
      book_instance = book_instance_fixture()
      assert %Ecto.Changeset{} = Books.change_book_instance(book_instance)
    end
  end
end
