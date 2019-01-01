defmodule ReadtomeWeb.MeView do
  use ReadtomeWeb, :view

  def render("index.json", %{user: user}) do
    render_one(user, ReadtomeWeb.UserView, "user.json")
  end
end
