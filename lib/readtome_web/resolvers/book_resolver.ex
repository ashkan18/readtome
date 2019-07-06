defmodule ReadtomeWeb.Resolvers.BookResolver do
  alias Readtome.Books
  def find_book_instances(_parent, args, _resolution) do
    %{lat: lat, lng: lng, term: term} = args
    {:ok, Books.list_book_instance(%{lat: lat, lng: lng, term: term, offerings: args[:offerings]})}
  end

  def find_in_the_wild(_parent, %{isbn: isbn}, _resolution) do
    Books.find_in_the_wild(isbn)
  end

  def post_book(_parent, args, %{context: %{current_user: current_user}}) do
    Books.create_book_instance(Map.merge(args, %{user_id: current_user.id}))
  end
end
