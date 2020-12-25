defmodule ReadtomeWeb.Resolvers.User do
  def me(_parent, _args, %{context: %{current_user: user}}) do
    user = Readtome.Accounts.get_user!(user.id)
    {:ok, user}
  end
end
