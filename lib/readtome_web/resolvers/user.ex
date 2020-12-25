defmodule ReadtomeWeb.Resolvers.User do
  def me(_parent, _args, %{context: %{current_user: user}}) do
    {:ok, user}
  end
end
