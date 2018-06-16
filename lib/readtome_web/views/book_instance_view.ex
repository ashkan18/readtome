defmodule ReadtomeWeb.BookInstanceView do
  use ReadtomeWeb, :view
  alias ReadtomeWeb.BookInstanceView

  def render("index.json", %{book_instance: book_instance}) do
    %{data: render_many(book_instance, BookInstanceView, "book_instance.json")}
  end

  def render("show.json", %{book_instance: book_instance}) do
    %{data: render_one(book_instance, BookInstanceView, "book_instance.json")}
  end

  def render("book_instance.json", %{book_instance: book_instance}) do
    %{id: book_instance.id,
      condition: book_instance.condition,
      medium: book_instance.medium,
      offerings: book_instance.offerings,
      location: Geo.JSON.encode(book_instance.location),
      book: render_one(book_instance.book, ReadtomeWeb.BookView, "book.json"),
      user: render_one(book_instance.user, ReadtomeWeb.UserView, "user.json")}
  end
end
