defmodule ReadtomeWeb.Resolvers.Book do
  def find_book_instances(_parent, args, _resolution) do
    %{lat: lat, lng: lng, term: term} = args
    {:ok, Readtome.Books.list_book_instance(%{lat: lat, lng: lng, term: term, offerings: args[:offerings]})}
  end

  def find_by_isbn(_parent, %{isbn: isbn}, _res) do
    case Readtome.Books.find_in_the_wild(isbn) do
      {:found_and_stored,  %{book: stored_book, external: _founded_book}} -> {:ok, stored_book}
      {:found, book} -> {:ok, book}
    end
  end
end
