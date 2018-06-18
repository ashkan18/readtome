defmodule ReadtomeWeb.AccountView do
  use ReadtomeWeb, :view
  alias ReadtomeWeb.AuthorView

  def render("loggedin.json", %{token: token}) do
    %{data: %{ token: token}}
  end

  def render("error.json", %{error: error}) do
    %{error: error}
  end
end