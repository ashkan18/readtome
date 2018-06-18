defmodule ReadtomeWeb.AccountController do
  use ReadtomeWeb, :controller
  alias Readtome.Accounts

  def signup(conn, %{"user"=> user_params }) do
    Accounts.create_user(user_params)
    |> login_reply(conn)
  end

  def login(conn, %{"user" => %{"username" => username, "password" => password}}) do
    Accounts.authenticate_user(username, password)
    |> login_reply(conn)
  end

  defp login_reply({:error, error}, conn) do
    render(conn, "error.json", error: error)
  end
  defp login_reply({:ok, user}, conn) do
    case ReadtomeWeb.Auth.Guardian.encode_and_sign(user) do
    {:ok, token, _claims} -> render(conn, "loggedin.json", token: token)
    _ -> render(conn, "error.json", error: "Cannot create token")
    end
  end
end