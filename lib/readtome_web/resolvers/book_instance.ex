defmodule ReadtomeWeb.Resolvers.BookInstance do
  alias Readtome.Books

  def post_book(_parent, args, %{context: %{current_user: user}}) do
    Books.create_book_instance(user, args)
  end
end
