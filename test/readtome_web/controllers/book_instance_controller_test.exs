defmodule ReadtomeWeb.BookInstanceControllerTest do
  use ReadtomeWeb.ConnCase

  alias Readtome.Books
  alias Readtome.Books.BookInstance

  @create_attrs %{condition: "some condition", medium: "some medium", offerings: "some offerings"}
  @update_attrs %{condition: "some updated condition", medium: "some updated medium", offerings: "some updated offerings"}
  @invalid_attrs %{condition: nil, medium: nil, offerings: nil}

  def fixture(:book_instance) do
    {:ok, book_instance} = Books.create_book_instance(@create_attrs)
    book_instance
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all book_instance", %{conn: conn} do
      conn = get conn, book_instance_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create book_instance" do
    test "renders book_instance when data is valid", %{conn: conn} do
      conn = post conn, book_instance_path(conn, :create), book_instance: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, book_instance_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "condition" => "some condition",
        "medium" => "some medium",
        "offerings" => "some offerings"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, book_instance_path(conn, :create), book_instance: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update book_instance" do
    setup [:create_book_instance]

    test "renders book_instance when data is valid", %{conn: conn, book_instance: %BookInstance{id: id} = book_instance} do
      conn = put conn, book_instance_path(conn, :update, book_instance), book_instance: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, book_instance_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "condition" => "some updated condition",
        "medium" => "some updated medium",
        "offerings" => "some updated offerings"}
    end

    test "renders errors when data is invalid", %{conn: conn, book_instance: book_instance} do
      conn = put conn, book_instance_path(conn, :update, book_instance), book_instance: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete book_instance" do
    setup [:create_book_instance]

    test "deletes chosen book_instance", %{conn: conn, book_instance: book_instance} do
      conn = delete conn, book_instance_path(conn, :delete, book_instance)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, book_instance_path(conn, :show, book_instance)
      end
    end
  end

  defp create_book_instance(_) do
    book_instance = fixture(:book_instance)
    {:ok, book_instance: book_instance}
  end
end
